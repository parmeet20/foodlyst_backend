import { getAllUserTransactions } from "../helpers/prisma/getAllUserTransactions";
import { isUserAuthenticated } from "../helpers/utils/isUserAuthenticated";
import { AuthRequest } from "../middleware/authMiddleware";
import { Response } from "express";

export const getAllUserTransactionsHandler = async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    try {
        const isUserAuthorized = await isUserAuthenticated(req, Number(id));
        if (!isUserAuthorized) res.status(200).json({
            message: "user is not autheicated"
        })
        const txs = await getAllUserTransactions(Number(id));
        if (!txs) res.status(200).json({
            message: "error fetching txs"
        })
        res.status(200).json(txs)
    } catch (error) {
        res.status(200).json({
            message: "user is not autheicated"
        })
    }
}