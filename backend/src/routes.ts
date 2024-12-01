// routes.ts
import { Express } from "express";
import { AuthController } from "./controllers/authController";
import { ProfileController } from "./controllers/profileController";
import { AuthMiddleware } from "./controllers/authMiddleware";
import { getUsers } from "./controllers/userController";
import {
    sendConnectionRequest,
    getPendingRequests,
    respondToRequest,
    getConnections,
    unconnectConnection,
} from "./controllers/connectionController";
import { ChatController } from "./controllers/chatController";

export const defineRoutes = (app: Express) => {
    app.get("/api", (req, res) => {
        res.json({ test: ["berto", "matthew", "indra", "hs"] });
    });

    // Auth Routes
    app.post("/api/register", AuthController.signup);
    app.post("/api/login", AuthController.signin);
    app.get("/api/test", AuthMiddleware.authorization, AuthController.test);
    app.post("/api/logout", AuthController.logout);
    app.get(
        "/api/protected",
        AuthMiddleware.authorization,
        (req, res) => {
        res.json({
            status: true,
            message: "You have access to this protected route",
            user: req.user,
        });
        }
    );
    app.get("/api/user", AuthMiddleware.authorization, AuthController.getUser);
    app.get("/api/user/:id", AuthMiddleware.authorization, AuthController.getUserById);
    // Profile Routes
    
    app.get("/api/profil/:id", ProfileController.getProfile);
    app.put("/api/profil/:id", ProfileController.setProfile);
    app.get("/api/profil", ProfileController.getAllProfiles);

    // User Routes
    app.get("/api/users", getUsers);

    // Connection Routes
    app.post("/api/connections/request", sendConnectionRequest);
    app.get("/api/connections/requests/:userId", getPendingRequests);
    app.post("/api/connections/respond", respondToRequest);
    app.get("/api/connections/:userId", getConnections);
    app.delete("/api/connections/unconnect", unconnectConnection);
    
    //chat routes
    app.get("/api/chat/:userId", AuthMiddleware.authorization, ChatController.getChat);
    app.post("/api/chat/store/", AuthMiddleware.authorization, ChatController.storeChat);
};
