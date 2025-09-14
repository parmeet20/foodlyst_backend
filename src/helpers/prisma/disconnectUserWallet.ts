import { prisma } from "../../utils/prismaClient";
import { User } from "../../validations/user.validation";
import { getUserById } from "./getUserById";

export const disconnectUserWallet = async (userId: number): Promise<User | null> => {
    try {
        const user = await getUserById(userId);
        if (!user) return null;

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: {
                walletConnected: false,
                walletAddress: "",  // or "null" string if your schema expects that
                // optionally reset balance if required, e.g. balance: 0
            }
        });

        return updatedUser;
    } catch (error) {
        console.error("Error disconnecting user wallet:", error);
        return null;
    }
};
