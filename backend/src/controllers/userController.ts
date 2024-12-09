import { Request, Response } from "express";
import { prisma } from "../prisma";

const serializeUser = (user: any) => {
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

      const usersWithConnectionStatus = users.map((user) => ({
        ...serializeUser(user),
        isConnected: false,
      }));

      res.status(200).json({
        success: true,
        message: "Users fetched successfully",
        body: usersWithConnectionStatus,
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

  getUsersLoggedIn: async (req: Request, res: Response) => {
    const { search } = req.query;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: User ID not available",
      });
    }

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

      const usersWithConnectionStatus = await Promise.all(
        users.map(async (user) => {
          const isConnected =
            (await prisma.connection.count({
              where: { from_id: BigInt(userId), to_id: BigInt(user.id) },
            })) > 0;

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
        body: usersWithConnectionStatus,
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
