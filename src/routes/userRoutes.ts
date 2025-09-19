import { Router } from "express";
import { connectWalletAndUpdateBalanceHandler, disconnectWalletHandler, getUserByIdHandler, getUserFromTokenHandler, loginUser, registerUser } from "../controller/userController";
import { authMiddleware } from "../middleware/authMiddleware";

const routes = Router();

routes.get("/", authMiddleware, getUserFromTokenHandler);
routes.get("/:id", authMiddleware, getUserByIdHandler);
routes.post("/register", registerUser);
routes.post("/login", loginUser);
routes.post("/connectwallet/:id", authMiddleware, connectWalletAndUpdateBalanceHandler);
routes.post("/disconnectwallet/:id", authMiddleware, disconnectWalletHandler);

export default routes;