import { Request, Response } from "express";
import { createUser } from "../helpers/prisma/createUser";
import { UserSchema } from "../validations/user.validation";
import { LoginDto } from "../validations/dtos/login.dto";
import { userExists } from "../helpers/utils/userExist";
import { isPasswordValid } from "../helpers/utils/isPasswordValid";
import { generateToken } from "../middleware/jwt.ts";
import { AuthRequest } from "../middleware/authMiddleware";
import { getUserById } from "../helpers/prisma/getUserById";
import { isUserAuthenticated } from "../helpers/utils/isUserAuthenticated";
import { connectUserWalletAndUpdateBalance } from "../helpers/prisma/connectUserWalletAndUpdateBalance";
import { connectWalletRequestSchema } from "../validations/dtos/connectWalletRequestSchema";
import { prisma } from "../utils/prismaClient";
import { disconnectUserWallet } from "../helpers/prisma/disconnectUserWallet";

export const getUserFromTokenHandler = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.id;
        const user = await getUserById(Number(userId));
        if (!user) res.status(401).json({
            message: "user not found"
        })
        res.status(200).json(user);
    } catch (error) {
        res.status(401).json({
            message: "error fetching user"
        })
    }
}

export const getUserByIdHandler = async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    try {
        const tokenUserReq = req.user?.id;
        const tokenUser = await getUserById(Number(tokenUserReq));

        const usrr = await getUserById(Number(id));
        if (!usrr) res.status(200).json({
            "message": "error fetching user with id:" + id
        })
        if (tokenUser?.role === "OWNER" || tokenUser?.email === usrr?.email) {
            res.status(200).json(usrr);
        }
        res.status(402).json({
            message: "Access to this user denied"
        })
    } catch (error) {
        res.status(200).json({
            "message": "error fetching user with id:" + id
        })
    }
}

export const registerUser = async (req: Request, res: Response) => {
    const parsed = UserSchema.parse(req.body);
    try {
        const newUser = await createUser(parsed);
        if (!newUser) {
            res.status(400).send("User already exists");
        }
        res.status(201).send(newUser);
    } catch (error) {
        return res.status(400).json({ err: error || "Invalid input" });
    }
}

export const loginUser = async (req: Request, res: Response) => {
    const { email, password } = req.body as LoginDto;
    try {
        const user = await userExists(email);
        if (!user) {
            return res.status(400).send("User not found");
        }

        if (!isPasswordValid(password, user.password)) {
            return res.status(400).send("Invalid credentials");
        }

        const token = generateToken({
            id: Number(user.id),
            email: user.email,
            role: user.role,
        });

        return res.status(200).json({ token });
    } catch (error: any) {
        return res.status(400).json({ err: error.message || "Invalid input" });
    }
};


export const connectWalletAndUpdateBalanceHandler = async (req: AuthRequest, res: Response) => {
    const { id } = req.params;

    try {
        const userId = Number(id);

        const isAuthenticated = await isUserAuthenticated(req, userId);
        if (!isAuthenticated) {
            return res.status(403).json({
                message: "User not authenticated"
            });
        }

        // Validate input data
        const parseResult = connectWalletRequestSchema.safeParse(req.body);
        if (!parseResult.success) {
            return res.status(400).json({
                message: "Validation failed",
                errors: parseResult.error.flatten()
            });
        }

        const { walletAddress, newBalance } = parseResult.data;

        // Call your service to update wallet and balance
        const updatedUser = await connectUserWalletAndUpdateBalance(userId, walletAddress, newBalance);

        if (!updatedUser) {
            res.status(500).json({ message: "Failed to update user wallet and balance" });
        }

        return res.status(200).json({
            message: "Wallet connected and balance updated successfully",
            user: updatedUser
        });

    } catch (error) {
        console.error("Error in connectWalletAndUpdateBalanceHandler:", error);
        return res.status(500).json({
            message: "Error adding wallet"
        });
    }
};

export const disconnectWalletHandler = async (req: AuthRequest, res: Response) => {
    const { id } = req.params;

    try {
        const userId = Number(id);
        const isAuthenticated = await isUserAuthenticated(req, userId);
        if (!isAuthenticated) {
            return res.status(403).json({ message: "User not authenticated" });
        }

        const updatedUser = await disconnectUserWallet(userId);
        if (!updatedUser) {
            return res.status(500).json({ message: "Failed to disconnect wallet" });
        }

        return res.status(200).json({
            message: "Wallet disconnected successfully",
            user: updatedUser,
        });
    } catch (error) {
        console.error("Error in disconnectWalletHandler:", error);
        return res.status(500).json({ message: "Error disconnecting wallet" });
    }
};
