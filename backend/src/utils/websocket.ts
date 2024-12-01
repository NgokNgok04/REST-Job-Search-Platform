import { WebSocket, WebSocketServer } from "ws";

const clients: Map<string, WebSocket> = new Map();

export function startWebSocketServer(port: number) {
    const server = new WebSocketServer({ port });

    server.on("connection", (ws: WebSocket) => {
        console.log("New connection");

        let userId: string | null = null; 

        //kalo type message
        ws.on("message", (data: string) => {
            try {
                const message = JSON.parse(data);
                //kalo type user_id, buat pertama kali connect
                if (message.type === "user_id" && message.userId) {
                    userId = message.userId;
                    if(userId){
                        clients.set(userId, ws);
                        ws.send(JSON.stringify({ type: "welcome", userId }));
                        console.log(`Assigned userId ${userId} to the connection`);
                    }
                //kalo type message biasa
                } else if (userId) {
                    switch (message.type) {
                        case "message":
                            // console.log(`Received message from user ${userId}:`, message);
                            handleDirectMessage(userId, message);
                            break;
                        default:
                            ws.send(JSON.stringify({ type: "error", message: "Unknown message type" }));
                    }
                } else {
                    ws.send(JSON.stringify({ type: "error", message: "userId is required" }));
                }
            } catch (error) {
                ws.send(JSON.stringify({ type: "error", message: "Invalid message format" }));
            }
        });

        ws.on("close", () => {
            if (userId) {
                console.log(`Connection closed for user: ${userId}`);
                clients.delete(userId);
            }
        });

        ws.on("error", (error) => {
            console.error(`WebSocket error for user ${userId}:`, error);
        });
    });
}

function handleDirectMessage(senderId: string, data: any) {
    const { recipientId, message } = data;
    if (clients.has(recipientId)) {
        const recipientWs = clients.get(recipientId)!;
        recipientWs.send(JSON.stringify({
            type: "message",
            username: data.username, 
            message,
            from: senderId,
            to: recipientId,
        }));

    } else {
        const senderWs = clients.get(senderId)!;
        senderWs.send(JSON.stringify({
            type: "error",
            message: `User ${recipientId} is not connected`,
        }));
    }
}
