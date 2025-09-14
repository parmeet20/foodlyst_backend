import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import { getAllMyGrabbedOrdersHistoryHandler, grabOrderFromRestrauntHandler } from "../controller/grabOrderController";

const routes = Router();

routes.get("/user/:id", authMiddleware, getAllMyGrabbedOrdersHistoryHandler);
routes.post("/order/:token", authMiddleware, grabOrderFromRestrauntHandler);

export default routes;