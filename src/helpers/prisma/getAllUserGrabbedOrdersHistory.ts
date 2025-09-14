import { prisma } from "../../utils/prismaClient";
import { GrabOffer } from "../../validations/grabOffer.validation";

export const getAllUserGrabbedOrdersHistory = async (userId: number): Promise<GrabOffer[] | null> => {
    try {
        const orders = await prisma.grabOffer.findMany()
        if (!orders) return null;
        return orders;
    } catch (error) {
        return null;
    }
}