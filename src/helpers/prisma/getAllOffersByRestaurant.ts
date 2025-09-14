import { prisma } from "../../utils/prismaClient"
import { FoodOfferRequest } from "../../validations/foodOfferRequest.validation";

export const getAllOffersByRestaurant = async (restaurantId: number): Promise<FoodOfferRequest[] | null> => {
    try {
        const offers = await prisma.foodOfferRequest.findMany({
            where: {
                restaurantId: restaurantId
            }
        })
        if (!offers) return null;

        const formattedOffers: FoodOfferRequest[] = offers.map((offer) => ({
            id: offer.id,
            foodName: offer.foodName,
            type: offer.type,
            latitude: offer.latitude,
            longitude: offer.longitude,
            quantity: offer.quantity,
            remainingQty: offer.remainingQty,
            maxPerPerson: offer.maxPerPerson,
            perQtyPrice: offer.perQtyPrice,
            isActive: offer.isActive,
            availableFrom: offer.availableFrom ? offer.availableFrom.toISOString() : undefined,
            availableTo: offer.availableTo ? offer.availableTo.toISOString() : undefined,
            restaurantId: offer.restaurantId,
        }));
        return formattedOffers;
    } catch (error) {
        return null;
    }
}