import { Router } from "express";
import { getAllRestaurantFoodOffersByIdHandler, createFoodOfferRequestHandler, getFoodByOfferIdHadler } from "../controller/foodOfferRequestController";
import { authMiddleware } from "../middleware/authMiddleware";
const routes = Router();

routes.get("/get/:id", getFoodByOfferIdHadler);
routes.get("/:restaurantId", getAllRestaurantFoodOffersByIdHandler);
routes.post("/create", authMiddleware, createFoodOfferRequestHandler);

export default routes;