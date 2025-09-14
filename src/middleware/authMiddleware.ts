import { Request, Response, NextFunction } from "express";
import { JwtPayload, verifyToken } from "./jwt.ts";

export interface AuthRequest extends Request {
    user?: JwtPayload;
}

export const authMiddleware = (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "No token provided" });
        }

        const token = authHeader.split(" ")[1];

        const decoded = verifyToken(token) as JwtPayload;

        if (!decoded || !decoded.id || !decoded.email || !decoded.role) {
            return res.status(401).json({ message: "Invalid or expired token" });
        }

        req.user = decoded;

        next();
    } catch (error) {
        console.error("Auth error:", error);
        return res.status(401).json({ message: "Unauthorized" });
    }
};
