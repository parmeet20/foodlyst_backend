import { prisma } from "../../utils/prismaClient"
import { FoodOrder } from "../../validations/foodOrder.validation";

export const isOrderTokenValid = async (token: string): Promise<FoodOrder | null> => {
    try {
        const order = await prisma.foodOrder.findUnique({
            where: {
                token: token,
            }
        })
        if (!token || !order) return null;
        return {
            ...order,
            createdAt: order.createdAt.toString()
        };
    } catch (error) {
        return null
    }
}