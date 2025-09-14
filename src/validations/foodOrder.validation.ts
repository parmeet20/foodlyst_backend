// foodOrder.validation.ts
import { z } from "zod";
import { OrderStatusSchema } from "./enums.validation";

export const FoodOrderSchema = z.object({
    id: z.number().int().optional(),
    userId: z.number().int(),
    restaurantId: z.number().int(),
    foodOfferRequestId: z.number().int(),
    quantity: z.number().int().positive(),
    totalPrice: z.number().positive(),
    status: OrderStatusSchema.default("PENDING"),
    createdAt: z.string().datetime().optional(),
    token: z.string().min(1),
    paymentId: z.string().min(1),
});

export type FoodOrder = z.infer<typeof FoodOrderSchema>;
