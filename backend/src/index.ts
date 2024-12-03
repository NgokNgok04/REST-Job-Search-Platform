// index.ts
import express, { Express } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { defineRoutes } from "./routes"; // Import the route definitions
import {startWebSocketServer} from "./utils/websocket";


const app: Express = express();

// Middleware
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }), 
);
app.use(express.json());
app.use(cookieParser());

// Initialize routes
defineRoutes(app);


const server = app.listen(3000, () => {
  console.log("Server listening on port 3000...");
});

//websocket 
const portWebsocket = 8000;
startWebSocketServer(portWebsocket);
console.log(`WebSocket server started on port ${portWebsocket}`);