import { Request, Response } from "express";
import { prisma } from "../prisma";

export const serializeUsers = (users: any[]) => {
  return users.map((user) => ({
    ...user,
    id: user.id.toString(),
    created_at: user.created_at.toISOString(),
    updated_at: user.updated_at.toISOString(),
  }));
};

export const getUsers = async (req: Request, res: Response) => {
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
    });
    res.status(200).json({
      success: true,
      message: "Users fetched successfully",
      body: serializeUsers(users),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch users.",
      error: error instanceof Error ? { message: error.message } : null,
    });
  }
};
