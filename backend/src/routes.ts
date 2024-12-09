// routes.ts
import { Express } from "express";
import { AuthController } from "./controllers/authController";
import { ProfileController } from "./controllers/profileController";
import { AuthMiddleware } from "./controllers/authMiddleware";
import { UserController } from "./controllers/userController";
import { ConnectionController } from "./controllers/connectionController";
import { ChatController } from "./controllers/chatController";
import { FeedController } from "./controllers/feedController";

export const defineRoutes = (app: Express) => {
  app.get("/api", (req, res) => {
    res.json({ test: ["berto", "matthew", "indra", "hs"] });
  });

  // User routes
  app.get("/api/users", UserController.getUsers);
  app.get(
    "/api/users-logged",
    AuthMiddleware.authorization,
    UserController.getUsersLoggedIn
  );
  app.get(
    "/api/logged-id,",
    AuthMiddleware.authorization,
    UserController.getLoggedInUser
  );

  // Connection routes
  app.post(
    "/api/connections/request",
    AuthMiddleware.authorization,
    ConnectionController.sendConnectionRequest
  );
  app.get(
    "/api/connections/requests",
    AuthMiddleware.authorization,
    ConnectionController.getPendingRequests
  );
  app.post(
    "/api/connections/respond",
    AuthMiddleware.authorization,
    ConnectionController.respondToRequest
  );
  app.get("/api/connections/:userId", ConnectionController.getConnections);
  app.get(
    "/api/connections-logged/:userId",
    AuthMiddleware.authorization,
    ConnectionController.getConnectionsLoggedIn
  );
  app.delete(
    "/api/connections/unconnect",
    AuthMiddleware.authorization,
    ConnectionController.unconnectConnection
  );

  // Feed routes
  app.get("/api/feed", AuthMiddleware.authorization, FeedController.getFeed);
  app.get(
    "/api/feed/:post_id",
    AuthMiddleware.authorization,
    FeedController.getPostById
  );
  app.post(
    "/api/feed",
    AuthMiddleware.authorization,
    FeedController.createPost
  );
  app.put(
    "/api/feed/:post_id",
    AuthMiddleware.authorization,
    FeedController.updatePost
  );
  app.delete(
    "/api/feed/:post_id",
    AuthMiddleware.authorization,
    FeedController.deletePost
  );

  // Auth Routes
  app.post("/api/register", AuthController.signup);
  app.post("/api/login", AuthController.signin);
  app.get("/api/test", AuthMiddleware.authorization, AuthController.test);
  app.post("/api/logout", AuthController.logout);
  app.get("/api/protected", AuthMiddleware.authorization, (req, res) => {
    res.json({
      status: true,
      success: true,
      message: "You have access to this protected route",
      user: req.user,
    });
  });
  app.get("/api/user", AuthMiddleware.authorization, AuthController.getUser);
  app.get(
    "/api/user/:id",
    AuthMiddleware.authorization,
    AuthController.getUserById
  );

  // Profile Routes
  app.get("/api/profil/:id", ProfileController.getProfile);
  app.put("/api/profil/:id", ProfileController.setProfile);
  app.get("/api/profil", ProfileController.getAllProfiles);

  //chat routes
  app.get(
    "/api/chat/:userId",
    AuthMiddleware.authorization,
    ChatController.getChat
  );
  app.post(
    "/api/chat/store/",
    AuthMiddleware.authorization,
    ChatController.storeChat
  );

  // app.use("/store", express.static(path.join(__dirname, "../store")));
};
