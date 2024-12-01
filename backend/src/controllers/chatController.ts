import { Request, Response, NextFunction } from "express";
import { prisma } from "../prisma";

export const ChatController = {
  getChat: async (req: Request, res: Response) => {
    const fromId = req.user.id;
    const userId = Number(req.params.userId);

    let chat = await prisma.chat.findMany({
        where: {
            from_id: fromId,
            to_id: userId,
        },
    });
    const reverseChat = await prisma.chat.findMany({
        where: {
            from_id: userId,
            to_id: fromId,
        },
    });
    const allChats = [...chat, ...reverseChat];

    if (allChats.length > 0) {
        const sortedChat = allChats.sort((a, b) => {
            return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
        });

        const stringifiedChat = sortedChat.map((item) => {
            return {
                id: item.id.toString(),
                from_id: item.from_id.toString(),
                to_id: item.to_id.toString(),
                message: item.message,
                timestamp: item.timestamp,
            };
        });

        return res.status(200).json({status: true, message: "Chat found", body: stringifiedChat});
    } else {
        return res.status(404).json({status: false, message: "Chat not found", body: null});
    }
  },


  storeChat: async (req: Request, res: Response) => {
    const fromId = req.user.id;    
    console.log(fromId);
    const { to_id, message, timestamp } = req.body;
    const toId = Number(to_id);
    const chatData = await prisma.chat.create({
      data: {
        from_id: fromId,
        to_id: toId,
        message: message,
        timestamp: timestamp,
      },
    });

    
    if(chatData){
      return res.status(200).json({status: true, message: "Chat stored", body: "MASUK"});
    }
    else{
      return res.status(500).json({status: false, message: "Failed to store chat", body: null});
    }

  },
};