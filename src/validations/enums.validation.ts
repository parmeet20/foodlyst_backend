// enums.validation.ts
import { z } from "zod";

export const RoleSchema = z.enum(["USER", "OWNER"]);
export type Role = z.infer<typeof RoleSchema>;

export const FoodTypeSchema = z.enum(["VEG", "NON_VEG", "DESSERT", "SNACK"]);
export type FoodType = z.infer<typeof FoodTypeSchema>;

export const OrderStatusSchema = z.enum(["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED"]);
export type OrderStatus = z.infer<typeof OrderStatusSchema>;
