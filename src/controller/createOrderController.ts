import { Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import { v4 as uuidv4 } from "uuid";
import { createOrderRequestSchema } from "../validations/dtos/createOrderRequest.dto";
import { prisma } from "../utils/prismaClient";
import { createOrder } from "../helpers/prisma/createOrder";
import { getAllOrdersByRestaurant } from "../helpers/prisma/getAllOrdersByRestraunt";
import { emitToNearbyUsers, emitToUser } from "../ws/websocketServer";
import { handleErrorResponse } from "../utils/errorResponse";

export const getAllRestaurantOrdersHandler = async (req: AuthRequest, res: Response) => {
    const { id } = req.params;

    try {
        const orders = await getAllOrdersByRestaurant(Number(id));

        if (!orders) {
            return handleErrorResponse(res, {
                statusCode: 404,
                message: "No orders found for this restaurant"
            });
        }

        return res.status(200).json({ success: true, orders });
    } catch (error) {
        return handleErrorResponse(res, {
            message: "Failed to fetch restaurant orders",
            error
        });
    }
};

export const getAllMyOrders = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) {
            return handleErrorResponse(res, { statusCode: 401, message: "Unauthorized" });
        }

        const userId = Number(req.params.id);
        if (isNaN(userId)) {
            return handleErrorResponse(res, { statusCode: 400, message: "Invalid user ID" });
        }

        if (req.user.role === "USER" && req.user.id !== userId) {
            return handleErrorResponse(res, { statusCode: 403, message: "User mismatch – not allowed" });
        }

        if (req.user.role === "OWNER") {
            const restaurant = await prisma.restaurant.findFirst({
                where: { ownerId: req.user.id }
            });

            if (!restaurant) {
                return handleErrorResponse(res, {
                    statusCode: 403,
                    message: "Owner has no associated restaurant"
                });
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
                success: true,
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
            success: true,
            message: "Orders fetched successfully",
            orders
        });
    } catch (error) {
        return handleErrorResponse(res, {
            message: "Failed to fetch user orders",
            error
        });
    }
};

export const createOrderHandler = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) {
            return handleErrorResponse(res, { statusCode: 401, message: "Unauthorized" });
        }

        if (req.user.role !== "USER") {
            return handleErrorResponse(res, { statusCode: 403, message: "Only users can place orders" });
        }

        const parsed = createOrderRequestSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: parsed.error.flatten()
            });
        }

        const { txHash, ...orderData } = parsed.data;

        const foodOffer = await prisma.foodOfferRequest.findUnique({
            where: { id: orderData.foodOfferRequestId }
        });

        if (!foodOffer) {
            return handleErrorResponse(res, { statusCode: 404, message: "Food offer not found" });
        }

        if (foodOffer.remainingQty < orderData.quantity) {
            return handleErrorResponse(res, {
                statusCode: 400,
                message: "Not enough quantity available"
            });
        }

        const totalPrice = foodOffer.perQtyPrice * orderData.quantity;
        const token = uuidv4();

        const createdOrder = await createOrder({
            ...orderData,
            userId: req.user.id,
            totalPrice,
            status: "PENDING",
            token,
            createdAt: new Date().toISOString()
        }, txHash);

        if (!createdOrder) {
            return handleErrorResponse(res, {
                statusCode: 500,
                message: "Failed to create order"
            });
        }

        // Emit to nearby users about updated quantity
        emitToNearbyUsers(
            foodOffer.latitude,
            foodOffer.longitude,
            [],
            {
                type: "FOOD_QUANTITY_UPDATED",
                payload: {
                    foodOfferId: foodOffer.id,
                    foodName: foodOffer.foodName,
                    remainingQty: foodOffer.remainingQty - orderData.quantity
                }
            }
        );

        // Emit to restaurant owner
        const restaurant = await prisma.restaurant.findUnique({
            where: { id: foodOffer.restaurantId }
        });

        if (!restaurant) {
            return handleErrorResponse(res, { message: "Restaurant not found" });
        }

        if (restaurant.ownerId) {
            emitToUser(restaurant.ownerId, {
                type: "NEW_ORDER",
                payload: {
                    orderId: Number(createdOrder.id),
                    message: `New order placed for your offer: ${foodOffer.foodName} Quantity: ${orderData.quantity}`,
                    quantity: orderData.quantity
                }
            });
        }

        // Emit confirmation to user
        emitToUser(req.user.id, {
            type: "ORDER_CONFIRMED",
            payload: {
                orderId: Number(createdOrder.id),
                message: "Your order has been placed successfully! Order ID: " + createdOrder.id
            }
        });

        return res.status(201).json({
            success: true,
            message: "Order created successfully",
            order: createdOrder
        });
    } catch (error) {
        return handleErrorResponse(res, {
            message: "Failed to create order",
            error
        });
    }
};
