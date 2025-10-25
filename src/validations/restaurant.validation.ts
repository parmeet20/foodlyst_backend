import { z } from "zod";

export const RestaurantSchema = z.object({
  id: z.number().int().optional(),
  name: z.string().min(1, "Restaurant name is required"),
  email: z.string().email(),
  contactNumber: z.string(),
  imageUrl: z.string(),
  latitude: z.number(),
  longitude: z.number(),
  ownerId: z.number(),
});

export type Restaurant = z.infer<typeof RestaurantSchema>;
