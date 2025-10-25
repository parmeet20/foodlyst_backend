import { z } from "zod";

export const RestaurantInputSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  imageUrl: z.string(),
  contactNumber: z.string(),
  latitude: z.number(),
  longitude: z.number(),
});

export type RestaurantInput = z.infer<typeof RestaurantInputSchema>;
