import bcrypt from 'bcryptjs';
import { prisma } from '../../utils/prismaClient'
import { User } from '../../validations/user.validation'
import { userExists } from '../utils/userExist';

export const createUser = async (user: User): Promise<User | null> => {
    try {
        const exists = await userExists(user.email);
        if (exists) return null;
        const hashedPass = bcrypt.hashSync(user.password, 8);
        const newUser = await prisma.user.create({
            data: {
                name: user.name,
                email: user.email,
                password: hashedPass,
                role: user.role,
                balance: 0,
                walletAddress: "",
                walletConnected: false
            }
        });
        return newUser;
    } catch (error) {
        console.error;
        return null;
    }
}