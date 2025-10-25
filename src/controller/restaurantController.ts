import { Request, Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import { userExists } from "../helpers/utils/userExist";
import { createRestaurant } from "../helpers/prisma/createRestraunt";
import { RestaurantInputSchema } from "../validations/dtos/restaurantRequest.dto";
import { prisma } from "../utils/prismaClient";
import { getRestaurantById } from "../helpers/prisma/getRestrauntById";

export const getAllRestaurants = async (req: Request, res: Response) => {
    try {
        const restaurants = await prisma.restaurant.findMany();

        const safeRestaurants = await Promise.all(
            restaurants.map(async (r) => {
                const owner = await prisma.user.findUnique({
                    where: { id: r.ownerId },
                    select: { walletAddress: true },
                });

                return {
                    ...r,
                    contactNumber: r.contactNumber?.toString(),
                    walletAddress: owner?.walletAddress || null,
                };
            })
        );

        res.status(200).json(safeRestaurants);
    } catch (error) {
        console.error("Error fetching restaurants:", error);
        res.status(500).send("Error fetching restaurants");
    }
};


export const getRestaurantByIdHandler = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const restaurant = await getRestaurantById(Number(id));
        if (!restaurant) {
            res.status(200).json({
                "message": "Restaurant not found with id:" + id
            })
            return;
        } const updatedRestaurant = {
            ...restaurant,
            walletAddress: await prisma.user.findUnique({
                where: { id: restaurant.ownerId },
                select: { walletAddress: true },
            }).then(user => user?.walletAddress || null)
        };

        res.status(200).json(updatedRestaurant);
    } catch (error) {
        res.status(200).send("Error fetching restaurant");
    }
}

export const registerRestaurant = async (req: AuthRequest, res: Response) => {
    try {
        const parsedRestaurant = RestaurantInputSchema.parse(req.body);

        const userId = req.user?.id;
        const email = req.user?.email;
        const role = req.user?.role;

        if (!userId || !email || role !== "OWNER") {
            return res.status(401).send("Unauthorized: Invalid user credentials");
        }

        const user = await userExists(email);
        if (!user || user.role !== "OWNER") {
            return res.status(403).send("Forbidden: Only owners can create a restaurant");
        }

        const restaurant = await createRestaurant(email, parsedRestaurant);
        return res.status(201).json(restaurant);

    } catch (error) {
        console.error("Error creating restaurant:", error);
        return res.status(500).send("Error creating restaurant");
    }
};
