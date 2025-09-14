import { Request, Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import { getAllOffersByRestaurant } from "../helpers/prisma/getAllOffersByRestaurant";
import { prisma } from "../utils/prismaClient";
import { FoodOfferRequestSchema } from "../validations/foodOfferRequest.validation";
import { createFoodOfferRequest } from "../helpers/prisma/createFoodOffer";
import { findFoodOfferById } from "../helpers/prisma/foodOrder";

export const getFoodByOfferIdHadler = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const offer = await findFoodOfferById(Number(id));
        if (!offer) res.status(200).json({
            message: "offer not found with id: " + id
        })
        res.status(200).json(offer);
    } catch (error) {
        res.status(200).json({
            message: "error fetching offer with id: " + id
        })
    }
}

export const getAllRestaurantFoodOffersByIdHandler = async (
    req: AuthRequest,
    res: Response
) => {
    const { restrauntId } = req.params;
    if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    const userId = req.user.id;
    const userRole = req.user.role;

    try {
        if (userRole !== "OWNER") {
            return res.status(403).json({ message: "Forbidden: Not a restaurant owner" });
        }

        const restaurant = await prisma.restaurant.findUnique({
            where: { id: Number(restrauntId) },
        });

        if (!restaurant || restaurant.ownerId !== userId) {
            return res.status(403).json({ message: "You do not own this restaurant" });
        }

        const offers = await getAllOffersByRestaurant(Number(restrauntId));

        if (!offers) {
            return res.status(404).json({
                message: `No offers found for restaurant ID ${restrauntId}`,
            });
        }

        return res.status(200).json(offers);
    } catch (error) {
        console.error("Error fetching offers:", error);
        return res.status(500).json({
            message: `Server error while fetching offers for restaurant ID ${restrauntId}`,
        });
    }
};


export const createFoodOfferRequestHandler = async (req: AuthRequest, res: Response) => {
    if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    const userId = req.user.id;
    const userRole = req.user.role;

    if (userRole !== "OWNER") {
        return res.status(403).json({ message: "Forbidden: Only restaurant owners can create offers" });
    }

    const parsed = FoodOfferRequestSchema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({ message: "Invalid input", errors: parsed.error.flatten() });
    }

    const offerRequest = parsed.data;

    const restaurant = await prisma.restaurant.findUnique({
        where: { id: offerRequest.restaurantId },
    });

    if (!restaurant || restaurant.ownerId !== userId) {
        return res.status(403).json({ message: "You do not own this restaurant" });
    }

    try {
        const createdOffer = await createFoodOfferRequest(offerRequest);
        return res.status(201).json(createdOffer);
    } catch (error: any) {
        return res.status(500).json({ message: error.message || "Internal server error" });
    }
};