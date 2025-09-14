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
        const safeRestaurants = restaurants.map(r => ({
            ...r,
            contactNumber: r.contactNumber?.toString(),
        }));
        res.status(200).json(safeRestaurants);

    } catch (error) {
        res.status(200).send("Error fetching restaurants");
    }
}

export const getRestaurantByIdHandler = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const restaurant = await getRestaurantById(Number(id));
        if (!restaurant) {
            res.status(200).json({
                "message": "Restaurant not found with id:" + id
            })
        }
        res.status(200).send(restaurant);
    } catch (error) {
        res.status(200).send("Error fetching restaurant");
    }
}

export const registerRestaurant = async (req: AuthRequest, res: Response) => {
    const parsedRestaurant = RestaurantInputSchema.parse(req.body);
    try {
        const userId = req.user?.id;
        const email = req.user?.email;
        const role = req.user?.role;
        if (!userId) {
            res.status(401).send("Unauthorized");
        }
        const user = await userExists(req.user!?.email);
        if (!user) {
            res.status(401).send("Unauthorized");
        }
        if (!user || user.role !== "OWNER" || role !== "OWNER") {
            res.status(401).send("you cannot create a restaurant");
        }
        const restaurant = await createRestaurant(email!, parsedRestaurant);
        res.status(201).send(restaurant);
    } catch (error) {
        res.status(401).send("error creating restaurant");
    }
}