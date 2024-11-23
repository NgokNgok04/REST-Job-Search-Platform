import express, { Request, Response } from "express";
import { AuthController } from "./controllers/authController";
import cors from 'cors';
// import jwt from "jsonwebtoken";
// import cookieParser from "cookie-parser";
// import bcrypt from "bcrypt";
// const bcrypt = require("bcrypt");

const app = express();

// w gatau best practice gimana, tapi di stack overflow gini 
app.use(cors({
  origin: "http://localhost:5173",
}))
app.use(express.json());

app.get("/api", (req, res) => {
  res.json({ test: ["berto", "matthew", "indra", "hals"] });
});

app.post("/api/signup", AuthController.signup);

app.get("/api/login", (req, res) => {
  //TODO
});

app.listen(3000, () => {
  console.log("Server listening on port 3000...");
});
