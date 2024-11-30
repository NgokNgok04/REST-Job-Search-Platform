import { Request, Response, NextFunction } from "express";
import { prisma } from "../prisma";

export const ChatController = {
  getChat: async (req: Request, res: Response) => {
    res.json({ message: "Chat route works",  body: req.user.username});
  },

  storeChat: async (req: Request, res: Response) => {
    
  },
};