// transaction.validation.ts
import { z } from "zod";

export const TransactionSchema = z.object({
    id: z.number().int().optional(),
    fromUserId: z.number().int(),
    toUserId: z.number().int(),
    amountPaid: z.number().int().positive(),
    orderId: z.number().int().optional(),
    txSignature: z.string(),
    createdAt: z.string().datetime().optional(),
});

export type Transaction = z.infer<typeof TransactionSchema>;
