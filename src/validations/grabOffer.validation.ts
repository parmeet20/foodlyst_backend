import { z } from "zod";

export const GrabOfferSchema = z.object({
  id: z.number().int().optional(),
  foodName: z.string().min(1, "Food name is required"),
  rating: z.number().min(0).max(5),
  qtyTaken: z.number().int().positive(),
  foodOfferRequestId: z.number().int(),
  restaurantId: z.number().int(),
  userId: z.number().int(),
});

export type GrabOffer = z.infer<typeof GrabOfferSchema>;
