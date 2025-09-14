import { z } from "zod";
import { RoleSchema } from "./enums.validation";

export const UserSchema = z.object({
  id: z.number().int().optional(),
  name: z.string().min(1, "Name is required"),
  email: z.string().email(),
  walletConnected: z.boolean().default(false),
  password: z.string().min(6, "Password must be at least 6 characters"),
  walletAddress: z.string().min(6, "Password must be at least 6 characters").optional().default(""),
  balance: z.number().default(0),
  role: RoleSchema.default("USER"),
});

export type User = z.infer<typeof UserSchema>;
