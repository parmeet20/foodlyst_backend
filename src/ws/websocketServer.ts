import { WebSocketServer, WebSocket } from "ws";
import jwt from "jsonwebtoken";
import { ENV } from "../config/loadEnv";
import { WebSocketMessage } from "./types";

interface ClientInfo {
    socket: WebSocket;
    userId: number;
    role: "USER" | "OWNER";
    latitude: number;
    longitude: number;
}

const clients: Map<number, ClientInfo[]> = new Map();

export const initWebSocketServer = (server: any) => {
    const wss = new WebSocketServer({ server });

    wss.on("connection", (ws, req) => {
        const params = new URLSearchParams(req.url?.split("?")[1]);
        const token = params.get("token");
        const lat = parseFloat(params.get("lat") || "");
        const lng = parseFloat(params.get("lng") || "");

        if (!token || isNaN(lat) || isNaN(lng)) {
            ws.close(1008, "Unauthorized or invalid location");
            return;
        }

        try {
            const decoded = jwt.verify(token, ENV.JWT_SECRET) as {
                id: number;
                role: "USER" | "OWNER";
            };

            if (
                typeof decoded.id !== "number" ||
                (decoded.role !== "USER" && decoded.role !== "OWNER")
            ) {
                throw new Error("Invalid token payload");
            }

            const userInfo: ClientInfo = {
                socket: ws,
                userId: decoded.id,
                role: decoded.role,
                latitude: lat,
                longitude: lng,
            };

            if (!clients.has(userInfo.userId)) {
                clients.set(userInfo.userId, []);
            }

            clients.get(userInfo.userId)!.push(userInfo);

            ws.on("close", () => {
                const userClients = clients.get(userInfo.userId);
                if (!userClients) return;

                const updatedClients = userClients.filter(c => c.socket !== ws);
                if (updatedClients.length === 0) {
                    clients.delete(userInfo.userId);
                } else {
                    clients.set(userInfo.userId, updatedClients);
                }
            });
        } catch (err) {
            ws.close(1008, "Invalid token");
        }
    });

    console.log("\n[WebSocket server started]");
};

function getDistanceInKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371;
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

export const emitToUser = (userId: number, data: WebSocketMessage) => {
    const userClients = clients.get(userId);
    if (!userClients) return;

    const message = JSON.stringify(data);
    userClients.forEach(client => {
        if (client.socket.readyState === WebSocket.OPEN) {
            client.socket.send(message);
        }
    });
};

export const emitToNearbyUsers = (
    latitude: number,
    longitude: number,
    excludeUserIds: number[] = [],
    data: WebSocketMessage
) => {
    const message = JSON.stringify(data);

    for (const [userId, clientList] of clients.entries()) {
        if (excludeUserIds.includes(userId)) continue;

        clientList.forEach(client => {
            const distance = getDistanceInKm(latitude, longitude, client.latitude, client.longitude);
            if (client.role === "USER" && distance <= 5 && client.socket.readyState === WebSocket.OPEN) {
                client.socket.send(message);
            }
        });
    }
};
