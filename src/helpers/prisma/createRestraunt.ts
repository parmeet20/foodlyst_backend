import { prisma } from "../../utils/prismaClient";
import { RestaurantInput } from "../../validations/dtos/restaurantRequest.dto";
import { Restaurant } from "../../validations/restaurant.validation";
import { userExists } from "../utils/userExist";

export const createRestaurant = async (
    email: string,
    restaurant: RestaurantInput
): Promise<Restaurant | null> => {
    try {
        const user = await userExists(email);
        if (!user) return null;


        const newRestaurant = await prisma.restaurant.create({
            data: {
                name: restaurant.name,
                imageUrl: restaurant.imageUrl,
                email: restaurant.email,
                contactNumber: restaurant.contactNumber,
                latitude: restaurant.latitude,
                longitude: restaurant.longitude,
                ownerId: Number(user.id),
                rating: 0,
            },
        });

        return newRestaurant;
    } catch (error) {
        console.error(error);
        return null;
    }
};
