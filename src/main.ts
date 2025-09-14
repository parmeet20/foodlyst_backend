import express from 'express';
import userRoutes from './routes/userRoutes';
import { ENV } from './config/loadEnv';
import restarauntRoutes from './routes/restarauntRoutes';
import foodOfferRoutes from './routes/createFoodOfferRoutes';
import orderRoutes from './routes/createOrderRoutes';
import cors from 'cors'
import grabRoutes from './routes/grabOrderRoutes';
import transactionRoutes from './routes/transactionRoutes';

const app = express();
app.use(cors());

app.use(express.json());
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/restaurant", restarauntRoutes);
app.use("/api/v1/food-offer", foodOfferRoutes);
app.use("/api/v1/order", orderRoutes);
app.use("/api/v1/grab", grabRoutes);
app.use("/api/v1/transaction", transactionRoutes);

app.listen(ENV.PORT, () => console.log("App running on port 8080"));