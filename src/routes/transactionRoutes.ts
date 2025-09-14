import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import { getAllUserTransactionsHandler } from "../controller/transactionsController";

const routes = Router();

routes.get("/:id", authMiddleware, getAllUserTransactionsHandler);

export default routes;