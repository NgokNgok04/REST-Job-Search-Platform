import express, { Request, Response } from "express";
import { AuthController } from "./controllers/authController";
import { ProfileController } from "./controllers/profileController";
import cors from "cors";
import { AuthMiddleware } from "./controllers/authMiddleware";
import cookieParser from "cookie-parser";

const app = express();

// w gatau best practice gimana, tapi di stack overflow gini
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
// app.use((req, res, next) => {
//   res.setHeader("Access-Control-Allow-Origin", "*");
//   res.setHeader("Access-Control-Allow-Origin", "GET, POST, PUT, DELETE");
//   res.setHeader("Access-Control-Allow-Origin", "Content-Type");
//   next();
// });

app.use(express.json());
app.use(cookieParser());

app.get("/api", (req, res) => {
  res.json({ test: ["berto", "matthew", "indra", "hs"] });
});

app.post("/api/register", AuthController.signup);
app.post("/api/login", AuthController.signin);

app.get("/api/profil/:id", ProfileController.getProfile);
app.put("/api/profil/:id", ProfileController.setProfile);
app.get(
  "/api/profil",
  AuthMiddleware.authorization,
  ProfileController.getAllProfiles
);

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

app.get("/api/test", AuthMiddleware.authorization, AuthController.test);

app.listen(3000, () => {
  console.log("Server listening on port 3000...");
});
