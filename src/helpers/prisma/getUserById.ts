import { prisma } from "../../utils/prismaClient";
import { UserDetailsResponse } from "../../validations/dtos/userDetailsResponse.dto";

export const getUserById = async (id: number): Promise<UserDetailsResponse | null> => {
    try {
        const user = await prisma.user.findUnique({
            where: {
                id: Number(id)
            }
        })
        if (!user) {
            return null;
        }
        let userResp: UserDetailsResponse = {
            id: user!?.id,
            name: user!?.name,
            email: user!?.email,
            role: user!?.role,
            balance: user!?.balance,
            walletAddress: user!?.walletAddress,
            walletConnected: user!?.walletConnected,
        }
        return userResp;
    } catch (error) {
        return null;
    }
}