import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import { createOrderHandler, getAllMyOrders, getAllRestaurantOrdersHandler } from "../controller/createOrderController";

const routes = Router();

routes.get("/:id", authMiddleware, getAllMyOrders);
routes.get("/restaurant/:id", getAllRestaurantOrdersHandler);
routes.post("/create", authMiddleware, createOrderHandler);

export default routes;