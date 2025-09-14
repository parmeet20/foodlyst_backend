import { z } from "zod";

export const NotificationSchema = z.object({
  id: z.number().int().optional(),
  userId: z.number().int(),
  message: z.string().min(1, "Message is required"),
  qty: z.number().int().positive(),
});

export type Notification = z.infer<typeof NotificationSchema>;
