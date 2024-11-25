import express, { Request, Response } from "express";
import cors from "cors";
import { prisma } from "./prisma";
import { AuthController } from "./controllers/authController";
import { getUsers } from "./controllers/userController";
import {
  sendConnectionRequest,
  getPendingRequests,
  respondToRequest,
  getConnections,
  unconnectConnection,
} from "./controllers/connectionController";
// import jwt from "jsonwebtoken";
// import cookieParser from "cookie-parser";
// import bcrypt from "bcrypt";
// const bcrypt = require("bcrypt");

const app = express();

// w gatau best practice gimana, tapi di stack overflow gini
app.use(
  cors({
    origin: "http://localhost:5173",
  })
);
app.use(express.json());

app.get("/api", (req, res) => {
  res.json({ test: ["berto", "matthew", "indra", "hals"] });
});

app.post("/api/signup", AuthController.signup);
app.post("/api/login", AuthController.signin);

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

process.on("SIGINT", async () => {
  await prisma.$disconnect();
  server.close(() => {
    console.log("Server closed.");
    process.exit(0);
  });
});
