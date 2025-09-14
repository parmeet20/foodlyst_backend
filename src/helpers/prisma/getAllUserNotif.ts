import { prisma } from "../../utils/prismaClient";
import { Notification } from "../../validations/notification.validation";

// Return array of notifications or empty array
export const getAllUserNotifications = async (userId: number): Promise<Notification[] | null> => {
    try {
        const notifications = await prisma.notification.findMany({
            where: {
                userId: userId,
            },
            orderBy: {
                createdAt: "desc", // optional: sort latest first
            },
        });

        return notifications;
    } catch (error) {
        console.error("Error fetching notifications:", error);
        return null;
    }
};
