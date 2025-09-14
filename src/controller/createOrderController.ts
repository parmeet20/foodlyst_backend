import { Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import { v4 as uuidv4 } from "uuid";
import { createOrderRequestSchema } from "../validations/dtos/createOrderRequest.dto";
import { prisma } from "../utils/prismaClient";
import { createOrder } from "../helpers/prisma/createOrder";
import { getAllOrdersByRestaurant } from "../helpers/prisma/getAllOrdersByRestraunt";
import { emitToNearbyUsers, emitToUser } from "../ws/websocketServer";

export const getAllRestaurantOrdersHandler = async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    try {
        const orders = await getAllOrdersByRestaurant(Number(id));
        if (!orders) res.status(200).json({
            message: "error fetching orders of restaurant"
        })
        res.status(200).json(orders);
    } catch (error) {
        res.status(200).json({
            message: "error fetching orders of restaurant"
        })
    }
}

export const getAllMyOrders = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const userId = Number(req.params.id);
        if (isNaN(userId)) {
            return res.status(400).json({ message: "Invalid user ID" });
        }

        if (req.user.role === "USER") {
            if (req.user.id !== userId) {
                return res.status(403).json({ message: "User mismatch – not allowed" });
            }
        }

        if (req.user.role === "OWNER") {
            const restaurant = await prisma.restaurant.findFirst({
                where: { ownerId: req.user.id }
            });
            if (!restaurant) {
                return res.status(403).json({ message: "Owner has no restaurant" });
            }
            const orders = await prisma.foodOrder.findMany({
                where: { userId, restaurantId: restaurant.id },
                include: {
                    restaurant: true,
                    foodOffer: true,
                    Transaction: true
                }
            });
            return res.status(200).json({
                message: "Orders fetched successfully",
                orders
            });
        }

        const orders = await prisma.foodOrder.findMany({
            where: { userId },
            include: {
                restaurant: true,
                foodOffer: true,
                Transaction: true
            }
        });

        return res.status(200).json({
            message: "Orders fetched successfully",
            orders
        });
    } catch (error) {
        console.error("❌ Error in getAllMyOrders:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};


export const createOrderHandler = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        if (req.user.role !== "USER") {
            return res.status(403).json({ message: "Only USER role can place orders" });
        }

        const parsed = createOrderRequestSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({
                message: "Validation failed",
                errors: parsed.error.flatten()
            });
        }

        const { txHash, ...orderData } = parsed.data;

        const foodOffer = await prisma.foodOfferRequest.findUnique({
            where: { id: orderData.foodOfferRequestId }
        });

        if (!foodOffer) {
            return res.status(404).json({ message: "Food offer not found" });
        }

        if (foodOffer.remainingQty < orderData.quantity) {
            return res.status(400).json({ message: "Not enough quantity available" });
        }

        const totalPrice = foodOffer.perQtyPrice * orderData.quantity;
        const token = uuidv4();

        const createdOrder = await createOrder({
            ...orderData,
            userId: req.user.id,
            totalPrice,
            status: "PENDING",
            token,
            createdAt: new Date().toISOString(),
        }, txHash);

        if (!createdOrder) {
            return res.status(500).json({ message: "Failed to create order" });
        }

        //  1. Notifying nearby users about quantity update
        emitToNearbyUsers(
            foodOffer.latitude,
            foodOffer.longitude,
            [],
            {
                type: "FOOD_QUANTITY_UPDATED",
                payload: {
                    foodOfferId: foodOffer.id,
                    foodName: foodOffer.foodName,
                    remainingQty: foodOffer.remainingQty - orderData.quantity,
                }
            }
        );

        //  2. Notifying the restaurant owner
        const restaurant = await prisma.restaurant.findUnique({
            where: { id: foodOffer.restaurantId }
        });

        if (!restaurant) {
            return res.status(200).json({ message: "Restaurant not found" });
        }

        if (restaurant.ownerId) {
            emitToUser(restaurant.ownerId, {
                type: "NEW_ORDER",
                payload: {
                    orderId: Number(createdOrder.id),
                    message: `New order placed for your offer: ${foodOffer.foodName} Quantity: ${orderData.quantity}`,
                    quantity: orderData.quantity,
                }
            });
        }

        //  3. Notifying the user (confirmation)
        emitToUser(req.user.id, {
            type: "ORDER_CONFIRMED",
            payload: {
                orderId: Number(createdOrder.id),
                message: "Your order has been placed successfully! for id: " + createdOrder.id
            }
        });

        return res.status(201).json({
            message: "Order created successfully",
            order: createdOrder
        });

    } catch (error) {
        console.error("❌ Error in createOrderHandler:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
