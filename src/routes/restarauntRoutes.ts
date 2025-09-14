import { Router } from "express";
import { getAllRestaurants, getRestaurantByIdHandler, registerRestaurant } from "../controller/restaurantController";
import { authMiddleware } from "../middleware/authMiddleware";

const routes = Router();

routes.get("/", getAllRestaurants);
routes.get("/:id", getRestaurantByIdHandler);
routes.post("/create", authMiddleware, registerRestaurant);

export default routes;