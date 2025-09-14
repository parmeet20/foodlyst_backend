import { z } from "zod";

// 📦 Schema for validating order creation requests
export const createOrderRequestSchema = z.object({
    restaurantId: z
        .number()
        .int()
        .positive("Restaurant ID must be a positive integer"),

    foodOfferRequestId: z
        .number()
        .int()
        .positive("Food Offer Request ID must be a positive integer"),

    quantity: z
        .number()
        .int()
        .positive("Quantity must be greater than 0")
        .max(10, "Cannot order more than 10 items at once"), // optional business rule

    paymentId: z
        .string()
        .min(5, "Payment ID must be at least 5 characters long")
        .max(100, "Payment ID too long"),

    txHash: z
        .string()
        .min(5, "Transaction hash must be provided") // optional: add length/format validation
});

// 🔄 TypeScript type to use in services/controllers
export type CreateOrderRequestDto = z.infer<typeof createOrderRequestSchema>;
