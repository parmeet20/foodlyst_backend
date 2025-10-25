// foodOfferRequest.validation.ts
import { z } from "zod";
import { FoodTypeSchema } from "./enums.validation";

export const FoodOfferRequestSchema = z.object({
  id: z.number().int().optional(),
  foodName: z.string().min(1, "Food name is required"),
  imageUrl: z.string(),
  type: FoodTypeSchema,
  latitude: z.number(),
  longitude: z.number(),
  quantity: z.number().int().positive(),
  remainingQty: z.number().int().nonnegative().optional(), // new
  maxPerPerson: z.number().int().positive(),
  perQtyPrice: z.number().positive().optional(), // optional for flexibility
  isActive: z.boolean().optional(),
  availableFrom: z.string().datetime().optional(), // ISO datetime string
  availableTo: z.string().datetime().optional(),
  restaurantId: z.number().int(),
});

export type FoodOfferRequest = z.infer<typeof FoodOfferRequestSchema>;
