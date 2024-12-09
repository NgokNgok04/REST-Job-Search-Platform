import { Request, Response } from "express";
import { prisma } from "../prisma";
import jwt from "jsonwebtoken";

export const serializeUser = (user: any) => {
  return {
    ...user,
    id: user.id.toString(),
  };
};

export const UserController = {
  getUsers: async (req: Request, res: Response) => {
    const { search } = req.query;

    try {
      const users = await prisma.user.findMany({
        where: search
          ? {
              OR: [
                {
                  username: {
                    contains: String(search),
                    mode: "insensitive",
                  },
                },
                {
                  full_name: {
                    contains: String(search),
                    mode: "insensitive",
                  },
                },
              ],
            }
          : {},
        select: {
          id: true,
          username: true,
          full_name: true,
          profile_photo_path: true,
        },
      });

      const isLogin = !!req.cookies.authToken;
      let loggedInUserIdBigInt: bigint | undefined;
      if (isLogin) {
        const decoded = jwt.verify(
          req.cookies.authToken,
          process.env.JWT_SECRET || ""
        );
        req.user = decoded;
        loggedInUserIdBigInt = BigInt(req.user.id);
      }

      const usersWithConnectionStatus = await Promise.all(
        users.map(async (user) => {
          let isConnected = false;

          if (isLogin) {
            const connectionExists = await prisma.connection.findFirst({
              where: {
                from_id: loggedInUserIdBigInt,
                to_id: user.id,
              },
            });
            isConnected = Boolean(connectionExists);
          }

          return {
            ...user,
            id: user.id.toString(),
            isConnected,
          };
        })
      );

      res.status(200).json({
        success: true,
        message: "Users fetched successfully",
        body: { users: usersWithConnectionStatus, isLogin: isLogin },
      });
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch users.",
        error: error instanceof Error ? { message: error.message } : null,
      });
    }
  },

  getLoggedInUser: (req: Request, res: Response) => {
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: no user found",
        error: null,
      });
    }

    res.status(200).json({
      success: true,
      message: "User is logged in",
      body: req.user.id,
    });
  },
};
