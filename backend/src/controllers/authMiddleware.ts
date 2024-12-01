import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const AuthMiddleware = {
  authorization: async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.authToken;
    if (!token) {
      return res.status(401).json({ status: false, message: "Unauthorized: no token" });
    }
    try {

      if (!process.env.JWT_SECRET) {
        return res
          .status(500)
          .json({ status: false, message: "Internal Server Error" });
      }
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      next();
    } catch (err) {
      return res.status(401).json({ status: false, message: "Unauthorized: unexpected error" });
    }
  },
  //   verifyToken: async (req, res, next) => {

  //   },
};
