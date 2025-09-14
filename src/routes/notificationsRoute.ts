import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import { getAllMyNotificationsHandler } from "../controller/notificationController";

const routes = Router();

routes.get("/:id", authMiddleware, getAllMyNotificationsHandler);

export default routes;