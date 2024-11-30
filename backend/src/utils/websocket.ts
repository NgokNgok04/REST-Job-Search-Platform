import { WebSocket, WebSocketServer } from "ws";

const clients: Map<string, WebSocket> = new Map();

export function startWebSocketServer(port: number) {
    const server = new WebSocketServer({ port });

    server.on("connection", (ws: WebSocket) => {
        console.log("New connection");

        //ini ganti ke user sebenernya lmao
        const userId = `user_${Math.random().toString(36).substring(7)}`;
        clients.set(userId, ws);
        ws.send(JSON.stringify({ type: "welcome", userId }));

        ws.on("message", (data: string) => {
            try {
                const message = JSON.parse(data);
                console.log(`Received message from user ${userId}:`, message);
                switch (message.type) {
                    case "message":
                        handleDirectMessage(userId, message);
                        break;
                    default:
                        ws.send(JSON.stringify({ type: "error", message: "Unknown message type" }));
                }
            } catch (error) {
                ws.send(JSON.stringify({ type: "error", message: "Invalid message format" }));
            }
        });

        ws.on("close", () => {
            console.log(`Connection closed for user: ${userId}`);
            clients.delete(userId);
        });
    });
}

function handleDirectMessage(senderId: string, message: any) {
    const { recipientId, text } = message;

    if (clients.has(recipientId)) {
        const recipientWs = clients.get(recipientId)!;
        recipientWs.send(JSON.stringify({
            type: "direct_message",
            from: senderId,
            text,
        }));
    } else {
        const senderWs = clients.get(senderId)!;
        senderWs.send(JSON.stringify({
            type: "error",
            message: `User ${recipientId} is not connected`,
        }));
    }
}
