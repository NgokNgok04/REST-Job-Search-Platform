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
            username: {
              contains: String(search),
              mode: "insensitive",
            },
          }
        : {},
    });
    res.status(200).json(serializeUsers(users));
  } catch (error) {
    console.error("Error fetching users:", error);
    res
      .status(500)
      .json({
        error: error instanceof Error ? error.message : "Unknown error",
      });
  }
};
