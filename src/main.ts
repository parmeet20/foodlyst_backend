import express from 'express';
import morgan from 'morgan';
import userRoutes from './routes/userRoutes';
import { ENV } from './config/loadEnv';
import restarauntRoutes from './routes/restarauntRoutes';
import foodOfferRoutes from './routes/createFoodOfferRoutes';
import orderRoutes from './routes/createOrderRoutes';
import cors from 'cors'
import http from "http";
import grabRoutes from './routes/grabOrderRoutes';
import transactionRoutes from './routes/transactionRoutes';
import notificationRoutes from './routes/notificationsRoute';
import { initWebSocketServer } from './ws/websocketServer';

const app = express();
app.use(express.json());
const server = http.createServer(app);
initWebSocketServer(server);
app.use(cors({
    origin: "https://foodlyst.vercel.app",
    credentials: true
}));
app.use(morgan('tiny'));

app.use(express.json());
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/restaurant", restarauntRoutes);
app.use("/api/v1/food-offer", foodOfferRoutes);
app.use("/api/v1/order", orderRoutes);
app.use("/api/v1/grab", grabRoutes);
app.use("/api/v1/transaction", transactionRoutes);
app.use("/api/v1/notification", notificationRoutes);

server.listen(ENV.PORT, () => console.log("\n[App running on port]: 8080\n"));

// docker-compose down -v
// docker-compose build --no-cache
// docker-compose up
