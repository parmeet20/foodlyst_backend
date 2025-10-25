import { Router } from "express";
import { getAllRestaurantFoodOffersByIdHandler, createFoodOfferRequestHandler, getFoodByOfferIdHadler, getAllOffersByLocationHandler } from "../controller/foodOfferRequestController";
import { authMiddleware } from "../middleware/authMiddleware";
const routes = Router();

routes.get("/get/:id", getFoodByOfferIdHadler);
routes.get("/:restaurantId", getAllRestaurantFoodOffersByIdHandler);
routes.get("/:latitude/:longitude", getAllOffersByLocationHandler);
routes.post("/create", authMiddleware, createFoodOfferRequestHandler);

export default routes;