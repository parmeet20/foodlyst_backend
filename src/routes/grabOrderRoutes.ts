import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import { getAllMyGrabbedOrdersHistoryHandler, grabOrderFromRestaurantHandler } from "../controller/grabOrderController";

const routes = Router();

routes.get("/user/:id", authMiddleware, getAllMyGrabbedOrdersHistoryHandler);
routes.post("/order/:token", authMiddleware, grabOrderFromRestaurantHandler);

export default routes;