import { Request, Response, NextFunction, response } from "express";
import { prisma } from "../prisma";
import responseAPI from "../utils/responseAPI";

export const ChatController = {
  getChatRooms: async (req: Request, res: Response) => {
    const userId = req.user.id; 
    try {
        const chats = await prisma.chat.findMany({
            where: {
                OR: [
                    { from_id: userId },
                    { to_id: userId },
                ],
            },
            orderBy: {
                timestamp: "desc",
            },
        });

        const chatRoomsMap = new Map<string, any>();

        for (const chat of chats) {
          const key = chat.from_id < chat.to_id
              ? `${chat.from_id}-${chat.to_id}`
              : `${chat.to_id}-${chat.from_id}`;
      
          if (!chatRoomsMap.has(key)) {
              chatRoomsMap.set(key, chat);
          }
      }

        const chatRooms = Array.from(chatRoomsMap.values()).map((chat) => {
          let otherUserId = "0"; 
            if(Number(chat.from_id) == userId){
              otherUserId = chat.to_id.toString();
            }else if(Number(chat.to_id)){
              otherUserId = chat.from_id.toString();
            }
            return {
                otherUserId,
                lastMessage: {
                    message: String(chat.message),
                    from_id: chat.from_id.toString(),
                    to_id: chat.to_id.toString(),
                    timestamp: String(chat.timestamp),
                },
            };
        });
        console.log(chatRooms);
        if (chatRooms.length > 0) {
            responseAPI(res, 200, true, "Chat rooms retrieved", { chatRooms });
        } else {
            responseAPI(res, 404, false, "No chat rooms found", null);
        }
    } catch (err) {
        console.error(err); 
        responseAPI(res, 500, false, "Internal Server Error", null);
    }
  },


  getChat: async (req: Request, res: Response) => {
    const fromId = req.user.id; 
    const userId = Number(req.params.userId); 

    try {
      const exists = await prisma.connection.count({
        where: {
          to_id: userId,
          from_id: fromId,
        },
      });

      const existsReverse = await prisma.connection.count({
        where: {
          to_id: fromId,
          from_id: userId,
        },
      });

      if (exists + existsReverse == 0) {
        responseAPI(res, 404, false, "User not connected", {
          connected: false,
        });
        return;
      }

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
          return (
            new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
          );
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
    } catch (err) {
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

    if (chatData) {
      responseAPI(res, 200, true, "Chat stored");
    } else {
      responseAPI(res, 500, false, "Failed to store chat");
    }
  },

  isConnected: async (req: Request, res: Response) => {
    const fromId = req.user.id;
    const userId = Number(req.params.userId);

    try {
      const exists = await prisma.connection.count({
        where: {
          to_id: userId,
          from_id: fromId,
        },
      });

      const existsReverse = await prisma.connection.count({
        where: {
          to_id: fromId,
          from_id: userId,
        },
      });

      if (exists + existsReverse > 0) {
        responseAPI(res, 200, true, "User connected", { connected: true });
      } else {
        responseAPI(res, 404, false, "User not connected", {
          connected: false,
        });
      }
    } catch (err) {
      responseAPI(res, 500, false, "Internal Server Error", null);
    }
  },
};
