import { prisma } from "../../utils/prismaClient";

export const findFoodOfferById = async (id: number) => {
    return prisma.foodOfferRequest.findUnique({
        where: { id }
    });
};

export const createFoodOrder = async (data: any) => {
    const createdOrder = await prisma.foodOrder.create({ data });

    await prisma.foodOfferRequest.update({
        where: { id: data.foodOfferRequestId },
        data: {
            remainingQty: {
                decrement: data.quantity
            }
        }
    });

    return {
        ...createdOrder,
        createdAt: createdOrder.createdAt.toISOString()
    };
};

export const findRestaurantByOwnerId = async (ownerId: number) => {
    return prisma.restaurant.findFirst({
        where: { ownerId }
    });
};

export const findOrdersByUserId = async (userId: number) => {
    return prisma.foodOrder.findMany({
        where: { userId },
        include: {
            restaurant: true,
            foodOffer: true,
            Transaction: true
        }
    });
};

export const findOrdersByUserAndRestaurant = async (
    userId: number,
    restaurantId: number
) => {
    return prisma.foodOrder.findMany({
        where: { userId, restaurantId },
        include: {
            restaurant: true,
            foodOffer: true,
            Transaction: true
        }
    });
};
