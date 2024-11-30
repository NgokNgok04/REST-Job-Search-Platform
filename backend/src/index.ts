import express, { Request, Response } from "express";
import cors from "cors";
import { AuthController } from "./controllers/authController";
import { ProfileController } from "./controllers/profileController";
import { AuthMiddleware } from "./controllers/authMiddleware";
import cookieParser from "cookie-parser";
import { getUsers } from "./controllers/userController";
import {
  sendConnectionRequest,
  getPendingRequests,
  respondToRequest,
  getConnections,
  unconnectConnection,
} from "./controllers/connectionController";
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

app.get("/api", (req, res) => {
  res.json({ test: ["berto", "matthew", "indra", "hs"] });
});

app.use("/store", express.static(path.join(__dirname, "../store")));

app.post("/api/register", AuthController.signup);
app.post("/api/login", AuthController.signin);
app.get("/api/test", AuthMiddleware.authorization, AuthController.test);

app.post("/api/logout", AuthController.logout);
app.get(
  "/api/protected",
  AuthMiddleware.authorization,
  (req: Request, res: Response) => {
    res.json({
      status: true,
      message: "You have access to this protected route",
      user: req.user,
    });
  }
);

app.get("/api/profil/:id", ProfileController.getProfile);
app.put(
  "/api/profil/:id",
  upload.single("profile_photo_path"),
  ProfileController.setProfile
);
app.get("/api/profil", ProfileController.getAllProfiles);

app.get("/api/test", AuthMiddleware.authorization, AuthController.test);

// User routes
app.get("/api/users", getUsers);

// Connection routes
app.post("/api/connections/request", sendConnectionRequest);
app.get("/api/connections/requests/:userId", getPendingRequests);
app.post("/api/connections/respond", respondToRequest);
app.get("/api/connections/:userId", getConnections);
app.delete("/api/connections/unconnect", unconnectConnection);

const server = app.listen(3000, () => {
  console.log("Server listening on port 3000...");
});
