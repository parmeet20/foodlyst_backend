import dotenv from "dotenv";

dotenv.config();

export const ENV = {
  DATABASE_URL: process.env.DATABASE_URL as string,
  PORT: process.env.PORT ? parseInt(process.env.PORT) : 8080,
  JWT_SECRET: process.env.JWT_SECRET as string,
  PAYPAL_CLIENT_ID: process.env.PAYPAL_CLIENT_ID as string,
  PAYPAL_CLIENT_SECRET: process.env.PAYPAL_CLIENT_SECRET as string
};
