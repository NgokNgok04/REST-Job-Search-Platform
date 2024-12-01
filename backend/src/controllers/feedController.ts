import { Request, Response } from "express";
import { prisma } from "../prisma";
import { error } from "console";

export const FeedController = {
  getFeed: async (req: Request, res: Response) => {
    const { cursor, limit } = req.query;

    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: User not logged in",
      });
    }

    try {
      const take = Number(limit) || 10;
      const cursorId =
        cursor && typeof cursor === "string" ? BigInt(cursor) : undefined;

      const connections = await prisma.connection.findMany({
        where: { from_id: BigInt(userId) },
        select: { to_id: true },
      });

      const connectedUserIds = connections.map((conn) => conn.to_id);

      // Postingan diri sendiri
      connectedUserIds.push(BigInt(userId));

      const posts = await prisma.feed.findMany({
        where: {
          user_id: { in: connectedUserIds },
        },
        orderBy: { created_at: "desc" },
        take: take + 1,
        ...(cursorId && {
          skip: 1,
          cursor: { id: cursorId },
        }),
      });

      // TODO:
      const hasNextPage = posts.length > take;
      if (hasNextPage) {
        posts.pop();
      }

      res.status(200).json({
        success: true,
        message: "Successfully fetch feed",
        body: {
          posts,
          nextCursor: hasNextPage ? posts[posts.length - 1].id : null,
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to fetch feed",
        error: error instanceof Error ? error.message : null,
      });
    }
  },

  createPost: async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const { content } = req.body;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: User not logged in",
        error: null,
      });
    }

    if (!content || content.length > 280) {
      return res.status(400).json({
        success: false,
        message: "Content must not exceed 280 characters",
        error: null,
      });
    }

    try {
      const post = await prisma.feed.create({
        data: {
          content,
          user_id: BigInt(userId),
        },
      });

      res.status(201).json({
        success: true,
        message: "Post created successfully",
        data: post,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to create post",
        error: error instanceof Error ? error.message : null,
      });
    }
  },

  updatePost: async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const { post_id } = req.params;
    const { content } = req.body;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unathorized: User not logged in",
        error: null,
      });
    }

    if (!content || content.length > 280) {
      return res.status(400).json({
        success: false,
        message: "Content must not exceed 280 characters",
        error: null,
      });
    }

    try {
      const postIdBigInt = BigInt(post_id);
      const post = await prisma.feed.findFirst({
        where: { id: postIdBigInt },
      });

      if (!post) {
        return res.status(404).json({
          success: false,
          message: "Post not found",
        });
      }

      if (post.user_id !== userId) {
        return res.status(403).json({
          success: false,
          message: "You are not authorized to edit this post",
          error: null,
        });
      }

      const updatedPost = await prisma.feed.update({
        where: { id: postIdBigInt },
        data: { content },
      });

      return res.status(200).json({
        success: false,
        message: "Post updated successfully",
        body: updatedPost,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Failed to update post",
        error: error instanceof Error ? error.message : null,
      });
    }
  },

  deletePost: async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const { post_id } = req.params;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unathorized: User not logged in",
        error: null,
      });
    }

    try {
      const postIdBigInt = BigInt(post_id);
      const post = await prisma.feed.findFirst({
        where: { id: postIdBigInt },
      });

      if (!post) {
        return res.status(404).json({
          success: false,
          message: "Post not found",
        });
      }

      if (post.user_id !== userId) {
        return res.status(403).json({
          success: false,
          message: "You are not authorized to delete this post",
          error: null,
        });
      }

      await prisma.feed.delete({
        where: { id: postIdBigInt },
      });

      return res.status(200).json({
        success: false,
        message: "Post deleted successfully",
        body: "wait",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Failed to update post",
        error: error instanceof Error ? error.message : null,
      });
    }
  },
};
