import { prisma } from "../../utils/prismaClient";
import { FoodOrder } from "../../validations/foodOrder.validation";

export const createOrder = async (
    orderDetails: FoodOrder,
    txHash: string
): Promise<FoodOrder | null> => {
    try {
        const result = await prisma.$transaction(async (tx) => {
            // Step 1: Fetch restaurant to get ownerId
            const restaurant = await tx.restaurant.findUnique({
                where: { id: orderDetails.restaurantId },
                select: { ownerId: true }
            });

            if (!restaurant) {
                throw new Error("Restaurant not found");
            }

            const amountToTransfer = orderDetails.totalPrice;

            // Step 2: Fetch sender (user placing order) and validate wallet & balance
            const sender = await tx.user.findUnique({
                where: { id: orderDetails.userId },
                select: { balance: true, walletConnected: true, walletAddress: true }
            });

            if (!sender) throw new Error("User not found");

            // Check if wallet is connected and address is not empty string
            if (!sender.walletConnected || sender.walletAddress === "") {
                // wallet not connected, so reject order creation
                return null;
            }

            if (sender.balance < amountToTransfer) {
                throw new Error("Insufficient balance");
            }

            // Step 3: Deduct and credit balances (float-safe)
            await tx.user.update({
                where: { id: orderDetails.userId },
                data: {
                    balance: {
                        decrement: amountToTransfer
                    }
                }
            });

            await tx.user.update({
                where: { id: restaurant.ownerId },
                data: {
                    balance: {
                        increment: amountToTransfer
                    }
                }
            });

            // Step 4: Create the order with PENDING status
            const createdOrder = await tx.foodOrder.create({
                data: {
                    userId: orderDetails.userId,
                    restaurantId: orderDetails.restaurantId,
                    foodOfferRequestId: orderDetails.foodOfferRequestId,
                    quantity: orderDetails.quantity,
                    totalPrice: amountToTransfer,
                    status: "PENDING",
                    token: orderDetails.token,
                    paymentId: orderDetails.paymentId,
                    createdAt: new Date()
                }
            });

            // Step 5: Confirm the order
            const confirmedOrder = await tx.foodOrder.update({
                where: { id: createdOrder.id },
                data: { status: "CONFIRMED" }
            });

            // Step 6: Decrease remaining quantity
            await tx.foodOfferRequest.update({
                where: { id: orderDetails.foodOfferRequestId },
                data: {
                    remainingQty: { decrement: orderDetails.quantity }
                }
            });

            // Step 7: Log the transaction
            await tx.transaction.create({
                data: {
                    fromUserId: orderDetails.userId,
                    toUserId: restaurant.ownerId,
                    amountPaid: amountToTransfer,
                    orderId: confirmedOrder.id,
                    txSignature: txHash,
                    createdAt: new Date()
                }
            });

            // Step 8: Notifications
            await tx.notification.createMany({
                data: [
                    {
                        orderId: confirmedOrder.id,
                        userId: orderDetails.userId,
                        message: `✅ Your order #${confirmedOrder.id} has been placed and confirmed.`,
                        createdAt: new Date(),
                        qty: orderDetails.quantity
                    },
                    {
                        orderId: confirmedOrder.id,
                        userId: restaurant.ownerId,
                        message: `🍽️ Order #${confirmedOrder.id} has been confirmed at your restaurant.`,
                        createdAt: new Date(),
                        qty: orderDetails.quantity
                    }
                ]
            });

            // Step 9: Return the result
            return {
                ...confirmedOrder,
                createdAt: confirmedOrder.createdAt.toISOString()
            };
        });

        return result;
    } catch (error) {
        console.error("❌ Transaction failed while creating order:", error);
        return null;
    }
};
