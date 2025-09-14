import { prisma } from "../../utils/prismaClient";

export const getAllOrdersByRestaurant = async (restaurantId: number): Promise<any[] | null> => {
    try {
        const orders = await prisma.foodOrder.findMany({
            where: {
                restaurantId: restaurantId
            }
        })
        if (!orders) return null;
        return orders;
    } catch (error) {
        return null
    }
}