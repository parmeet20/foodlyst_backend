import { prisma } from "../../utils/prismaClient";
import { Restaurant } from "../../validations/restaurant.validation";

export const getRestaurantById = async (restaurantId: number): Promise<Restaurant | null> => {
    try {
        const restaurant = await prisma.restaurant.findUnique({
            where: {
                id: restaurantId
            }
        });
        if (!restaurant) {
            return null;
        }
        return restaurant;
    } catch (error) {
        console.error;
        return null;
    }
}