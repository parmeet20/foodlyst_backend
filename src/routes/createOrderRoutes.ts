import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import { createOrderHandler, getAllMyOrders, getAllRestrauntOrdersHandler } from "../controller/createOrderController";

const routes = Router();

routes.get("/:id", authMiddleware, getAllMyOrders);
routes.get("/restraunt/:id", getAllRestrauntOrdersHandler);
routes.post("/create", authMiddleware, createOrderHandler);

export default routes;