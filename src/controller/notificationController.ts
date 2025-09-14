import { Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import { isUserAuthenticated } from "../helpers/utils/isUserAuthenticated";
import { getAllUserNotifications } from "../helpers/prisma/getAllUserNotif";

export const getAllMyNotificationsHandler = async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    try {
        const isAuthenticated = await isUserAuthenticated(req, Number(id));
        if (!isAuthenticated) res.status(403).json({
            message: "access denied"
        })
        const notifications = await getAllUserNotifications(Number(id));
        res.status(200).json(notifications);
    } catch (error) {
        res.status(200).json({
            message: "error fetching notifications"
        })
    }
}