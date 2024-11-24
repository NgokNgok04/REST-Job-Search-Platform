import express, { Request, Response } from "express";
import { AuthController } from "./controllers/authController";
import cors from 'cors';


const app = express();

// w gatau best practice gimana, tapi di stack overflow gini 
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}))
app.use(express.json());

app.get("/api", (req, res) => {
  res.json({ test: ["berto", "matthew", "indra", "hals"] });
});

app.post("/api/register", AuthController.signup);
app.post("/api/login", AuthController.signin);

app.listen(3000, () => {
  console.log("Server listening on port 3000...");
});
