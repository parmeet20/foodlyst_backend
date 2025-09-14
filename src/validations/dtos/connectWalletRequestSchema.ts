import z from "zod";

export const connectWalletRequestSchema = z.object({
    walletAddress: z.string().min(10, "Wallet address is too short"),
    newBalance: z.number().nonnegative("Balance must be zero or positive")
});
