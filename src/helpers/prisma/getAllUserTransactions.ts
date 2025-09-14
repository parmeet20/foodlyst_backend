import { prisma } from "../../utils/prismaClient";
import { Transaction } from "../../validations/transaction.validation";

export const getAllUserTransactions = async (userId: number): Promise<Transaction[] | null> => {
    try {
        const txs = await prisma.transaction.findMany({
            where: {
                OR: [
                    { toUserId: userId },
                    { fromUserId: userId }
                ]
            },
            orderBy: {
                createdAt: "desc"
            }
        });

        return txs.map(tx => ({
            ...tx,
            createdAt: tx.createdAt.toISOString()
        })) as Transaction[];

    } catch (error) {
        console.error("❌ Error fetching transactions:", error);
        return null;
    }
};
