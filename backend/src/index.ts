import express, { Request, Response } from "express";
import cors from "cors";
import { AuthController } from "./controllers/authController";
import { ProfileController } from "./controllers/profileController";
import { AuthMiddleware } from "./controllers/authMiddleware";
import cookieParser from "cookie-parser";
import { UserController } from "./controllers/userController";
import { ConnectionController } from "./controllers/connectionController";
import { FeedController } from "./controllers/feedController";
import upload from "./middleware/uploadImage";
import path from "path";

const app = express();

// w gatau best practice gimana, tapi di stack overflow gini
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

app.use("/store", express.static(path.join(__dirname, "../store")));

// Authentication and authorization
app.post("/api/register", AuthController.signup);
app.post("/api/login", AuthController.signin);
app.get("/api/test", AuthMiddleware.authorization, AuthController.test);
app.post("/api/logout", AuthController.logout);
app.get(
  "/api/protected",
  AuthMiddleware.authorization,
  (req: Request, res: Response) => {
    res.json({
      success: true,
      message: "You have access to this protected route",
      user: req.user,
    });
  }
);

// Profiles
app.get("/api/profil/:id", ProfileController.getProfile);
app.put(
  "/api/profil/:id",
  upload.single("profile_photo_path"),
  ProfileController.setProfile
);
app.get("/api/profil", ProfileController.getAllProfiles);

// User routes
app.get("/api/users", AuthMiddleware.authorization, UserController.getUsers);
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
app.get(
  "/api/connections/:userId",
  AuthMiddleware.authorization,
  ConnectionController.getConnections
);
app.delete(
  "/api/connections/unconnect",
  AuthMiddleware.authorization,
  ConnectionController.unconnectConnection
);

// Feed routes
app.get("/api/feed", AuthMiddleware.authorization, FeedController.getFeed);
app.post("/api/feed", AuthMiddleware.authorization, FeedController.createPost);
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

const server = app.listen(3000, () => {
  console.log("Server listening on port 3000...");
});
