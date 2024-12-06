import { Request, Response, NextFunction, response } from "express";
import { prisma } from "../prisma";
import responseAPI from "../utils/responseAPI";

export const ChatController = {
  getChat: async (req: Request, res: Response) => {
    const fromId = req.user.id;
    const userId = Number(req.params.userId);

    try{

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
          
          responseAPI(res, 200, true, "Chat found", stringifiedChat);
      } else {
          responseAPI(res, 404, false, "Chat not found", null);
      }
    } catch(err){
      responseAPI(res, 500, false, "Internal Server Error", null);
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
      responseAPI(res, 200, true, "Chat stored", chatData);
    }
    else{
      responseAPI(res, 500, false, "Failed to store chat", null);
    }

  },
};