import { prisma } from "../../utils/prismaClient";
import { FoodOfferRequest } from "../../validations/foodOfferRequest.validation";

export const createFoodOfferRequest = async (offerRequest: FoodOfferRequest) => {
    try {
        const offer = await prisma.foodOfferRequest.create({
            data: {
                foodName: offerRequest.foodName,
                type: offerRequest.type,
                latitude: offerRequest.latitude,
                longitude: offerRequest.longitude,
                quantity: offerRequest.quantity,
                remainingQty: offerRequest.quantity,
                maxPerPerson: offerRequest.maxPerPerson,
                perQtyPrice: Number(offerRequest.perQtyPrice),
                isActive: false,
                availableFrom: offerRequest.availableFrom
                    ? new Date(offerRequest.availableFrom)
                    : undefined,
                availableTo: offerRequest.availableTo
                    ? new Date(offerRequest.availableTo)
                    : undefined,
                restaurantId: offerRequest.restaurantId,
            },
        });

        return offer;
    } catch (error) {
        console.error("❌ Error creating food offer request:", error);
        throw new Error("Failed to create food offer request");
    }
};
