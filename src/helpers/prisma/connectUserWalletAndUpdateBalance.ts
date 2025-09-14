import { prisma } from "../../utils/prismaClient";
import { User } from "../../validations/user.validation";
import { getUserById } from "./getUserById";

export const connectUserWalletAndUpdateBalance = async (
    userId: number,
    walletAddress: string,
    newBalance: number
): Promise<User | null> => {
    try {
        const user = await getUserById(userId);
        if (!user) return null;

        const updatedUser = await prisma.user.update({
            where: {
                id: userId
            },
            data: {
                walletConnected: true,
                walletAddress,
                balance: newBalance
            }
        });

        return updatedUser;
    } catch (error) {
        console.error("Error updating user wallet and balance:", error);
        return null;
    }
};
