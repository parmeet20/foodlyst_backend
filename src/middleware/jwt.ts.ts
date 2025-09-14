import jwt from "jsonwebtoken";
import { ENV } from "../config/loadEnv";

export interface JwtPayload {
    id: number;
    email: string;
    role: string;
}

export const generateToken = (payload: JwtPayload): string => {
    return jwt.sign(payload, ENV.JWT_SECRET, { expiresIn: "1h" });
};

export const verifyToken = (token: string): JwtPayload | null => {
    try {
        return jwt.verify(token, ENV.JWT_SECRET) as JwtPayload;
    } catch (error) {
        return null;
    }
}