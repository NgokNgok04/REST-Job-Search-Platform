import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";


export const AuthMiddleware = {
    authorization: async (req: Request, res: Response, next: NextFunction) => {
        const token = req.cookies.authToken;
        if (!token) {
            return res.status(401).json({ status: false, message: "Unauthorized" });
        }

        try {
            const decoded = jwt.verify(token, "A_SECRET_TEMPLATE");
            req.user = decoded;
            next();
        } catch (err) {
            return res.status(401).json({ status: false, message: "Unauthorized" });
        }
    }
}