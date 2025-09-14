import { prisma } from "../../utils/prismaClient";
import { User } from "../../validations/user.validation";

export const userExists = async (email: string): Promise<User | null> => {
    try {
        const userExists = await prisma.user.findUnique({
            where: {
                email: email
            }
        });
        if (userExists) {
            return userExists;
        }
    } catch (error) {
        return null;
    }
    return null;
}