import { AuthRequest } from "../../middleware/authMiddleware";
import { getUserById } from "../prisma/getUserById";

export const isUserAuthenticated = async (req: AuthRequest, userId: number): Promise<boolean> => {
    if (!req.user) return false;
    try {
        const userIdReq = req.user.id;
        const user1 = await getUserById(userIdReq);
        const user2 = await getUserById(userId);
        if (!user1) return false;
        if (!user2) return false;
        return user1.email === user2.email;
    } catch (error) {
        return false;
    }
}