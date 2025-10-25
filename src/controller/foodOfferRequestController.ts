import { Request, Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import { getAllOffersByRestaurant } from "../helpers/prisma/getAllOffersByRestaurant";
import { prisma } from "../utils/prismaClient";
import { FoodOfferRequestSchema } from "../validations/foodOfferRequest.validation";
import { createFoodOfferRequest } from "../helpers/prisma/createFoodOffer";
import { findFoodOfferById } from "../helpers/prisma/foodOrder";
import { emitToNearbyUsers } from "../ws/websocketServer";

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
    req: Request,
    res: Response
) => {
    const { restaurantId } = req.params;

    try {
        const restaurant = await prisma.restaurant.findUnique({
            where: { id: Number(restaurantId) },
        });

        if (!restaurant) {
            return res.status(404).json({ message: "Restaurant not found" });
        }

        const offers = await getAllOffersByRestaurant(Number(restaurantId));

        if (!offers || offers.length === 0) {
            return res.status(404).json({
                message: `No offers found for restaurant ID ${restaurantId}`,
            });
        }

        return res.status(200).json(offers);
    } catch (error) {
        console.error("Error fetching offers:", error);
        return res.status(500).json({
            message: `Server error while fetching offers for restaurant ID ${restaurantId}`,
        });
    }
};
export const getAllOffersByLocationHandler = async (req: Request, res: Response) => {
    try {
        const { latitude, longitude } = req.params;
        const userLat = parseFloat(latitude);
        const userLon = parseFloat(longitude);

        // Validate input
        if (isNaN(userLat) || isNaN(userLon)) {
            return res.status(400).json({ error: "Invalid latitude or longitude" });
        }

        // Function to calculate distance using Haversine formula
        const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
            const R = 6371; // Earth's radius in km
            const dLat = (lat2 - lat1) * Math.PI / 180;
            const dLon = (lon2 - lon1) * Math.PI / 180;
            const a =
                Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                Math.sin(dLon / 2) * Math.sin(dLon / 2);
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            return R * c;
        };

        // Fetch all offers (assuming a database query)
        const offers = await prisma.foodOfferRequest.findMany(); // Replace with actual DB query

        // Filter offers within 50km
        const nearbyOffers = offers.filter(offer => {
            const distance = calculateDistance(userLat, userLon, offer.latitude, offer.longitude);
            return distance <= 50;
        });


        return res.status(200).json(nearbyOffers);
    } catch (error) {
        console.error("Error fetching offers:", error);
        return res.status(500).json({ error: "Internal server error" });
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
    if (restaurant.latitude && restaurant.longitude) {
        emitToNearbyUsers(
            restaurant.latitude,
            restaurant.longitude,
            [userId],
            {
                type: "NEW_OFFER",
                payload: {
                    restaurantId: restaurant.id,
                    restaurantName: restaurant.name,
                    message: `New food offer available at ${restaurant.name}`,
                },
            }
        );
    }

    try {
        const createdOffer = await createFoodOfferRequest(offerRequest);
        return res.status(201).json(createdOffer);
    } catch (error: any) {
        return res.status(500).json({ message: error.message || "Internal server error" });
    }
};