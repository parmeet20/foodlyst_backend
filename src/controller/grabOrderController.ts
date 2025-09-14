import { getAllUserGrabbedOrdersHistory } from "../helpers/prisma/getAllUserGrabbedOrdersHistory";
import { grabOrder } from "../helpers/prisma/grabOrder";
import { isOrderTokenValid } from "../helpers/utils/isOrderTokenValid";
import { isUserAuthenticated } from "../helpers/utils/isUserAuthenticated";
import { AuthRequest } from "../middleware/authMiddleware";
import { Response } from "express";

export const getAllMyGrabbedOrdersHistoryHandler = async (req: AuthRequest, res: Response) => {
    const { id } = req.params;

    try {
        const isUserValid = await isUserAuthenticated(req, Number(id));
        if (!isUserValid) {
            return res.status(403).json({
                message: "access denied"
            });
        }

        const orders = await getAllUserGrabbedOrdersHistory(Number(id));
        if (!orders) {
            return res.status(200).json({
                message: "error fetching grabbed orders"
            });
        }

        return res.status(200).json(orders);
    } catch (error) {
        console.error("Error in getAllMyGrabbedOrdersHistoryHandler:", error);
        return res.status(500).json({
            message: "error fetching grabbed orders"
        });
    }
};

export const grabOrderFromRestaurantHandler = async (req: AuthRequest, res: Response) => {
    const { token } = req.params;
    const { rating } = req.body;
    try {
        const order = await isOrderTokenValid(token);
        if (!order) {
            return res.status(200).json({
                message: "This token is not valid"
            });
        }
        const grabbedOrder = await grabOrder(order!, rating);
        if (!grabbedOrder) {
            res.status(200).json({
                message: "order already grabbed"
            });
        }
        console.log(grabbedOrder)
        res.status(201).json(grabbedOrder)
    } catch (error) {
        res.status(200).json({
            message: "error grabbing offer"
        });
    }
}