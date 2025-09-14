import { prisma } from "../../utils/prismaClient";
import { FoodOrder } from "../../validations/foodOrder.validation";
import { GrabOffer } from "../../validations/grabOffer.validation";

export const grabOrder = async (order: FoodOrder, rating: number): Promise<GrabOffer | null> => {
    try {
        if (!order) return null;

        const result = await prisma.$transaction(async (tx) => {

            if (order.status === "COMPLETED") return null;
            // Step 1: Mark the order as completed
            const updatedOrder = await tx.foodOrder.update({
                where: { id: order.id },
                data: { status: "COMPLETED" }
            });

            // Step 2: Get food offer details
            const foodOffer = await tx.foodOfferRequest.findUnique({
                where: { id: updatedOrder.foodOfferRequestId }
            });

            if (!foodOffer) throw new Error("Food offer request not found");

            // Step 3: Get restaurant details (for ownerId)
            const restaurant = await tx.restaurant.findUnique({
                where: { id: updatedOrder.restaurantId },
                select: { ownerId: true }
            });

            if (!restaurant) throw new Error("Restaurant not found");

            // Step 4: Create grab offer record (user grab tracking)
            const createdGrab = await tx.grabOffer.create({
                data: {
                    foodName: foodOffer.foodName,
                    rating: rating,
                    qtyTaken: updatedOrder.quantity,
                    foodOfferRequestId: updatedOrder.foodOfferRequestId,
                    restaurantId: updatedOrder.restaurantId,
                    userId: updatedOrder.userId
                }
            });

            // Step 5: Create notifications
            await tx.notification.createMany({
                data: [
                    {
                        orderId: updatedOrder.id,
                        userId: updatedOrder.userId,
                        message: `🎉 You successfully grabbed order #${updatedOrder.id} for "${foodOffer.foodName}". Enjoy your meal!`,
                        createdAt: new Date(),
                        qty: updatedOrder.quantity
                    },
                    {
                        orderId: updatedOrder.id,
                        userId: restaurant.ownerId,
                        message: `📦 Order #${updatedOrder.id} for "${foodOffer.foodName}" has been grabbed by a user.`,
                        createdAt: new Date(),
                        qty: updatedOrder.quantity
                    }
                ]
            });

            // Step 6: Return grab offer response
            return {
                foodName: createdGrab.foodName,
                rating: createdGrab.rating,
                qtyTaken: createdGrab.qtyTaken,
                foodOfferRequestId: createdGrab.foodOfferRequestId,
                restaurantId: createdGrab.restaurantId,
                userId: createdGrab.userId
            };
        });

        return result;
    } catch (error) {
        console.error("❌ Error in grabOrder:", error);
        return null;
    }
};
