import { Request, Response } from "express";
import { prisma } from "../prisma";
import { serializeUser } from "./userController";

const serializePost = (post: any) => {
  return {
    id: post.id.toString(),
    content: post.content,
    created_at: post.created_at.toISOString(),
    updated_at: post.updated_at.toISOString(),
    user_id: post.user_id.toString(),
  };
};

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
        cursor && typeof cursor === "string" && cursor !== "null"
          ? BigInt(cursor)
          : undefined;

      const connections = await prisma.connection.findMany({
        where: { from_id: BigInt(userId) },
        select: { to_id: true },
      });

      const connectedUserIds = connections.map((conn) => conn.to_id);
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
        include: {
          User: {
            select: {
              id: true,
              username: true,
              email: true,
              full_name: true,
              profile_photo_path: true,
            },
          },
        },
      });

      const hasNextPage = posts.length > take;
      if (hasNextPage) {
        posts.pop();
      }

      res.status(200).json({
        success: true,
        message: "Successfully fetch feed",
        body: {
          posts: posts.map((post) => ({
            post: {
              id: post.id.toString(),
              content: post.content,
              created_at: post.created_at.toISOString(),
              updated_at: post.updated_at.toISOString(),
            },
            user: serializeUser(post.User),
            isOwner: BigInt(userId) == post.user_id,
          })),
          nextCursor: hasNextPage
            ? posts[posts.length - 1].id.toString()
            : null,
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

  getPostById: async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const { post_id } = req.params;

    if (!userId || isNaN(Number(userId))) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: User not logged in",
        error: null,
      });
    }

    if (!post_id || isNaN(Number(post_id))) {
      return res.status(400).json({
        success: false,
        message: "Invalid post Id",
        error: null,
      });
    }

    try {
      const postIdBigInt = BigInt(post_id);
      const post = await prisma.feed.findFirst({
        where: { id: postIdBigInt },
      });

      if (!post) {
        return res.status(400).json({
          success: false,
          message: "Invalid post",
          error: null,
        });
      }

      const isFriend = await prisma.connection.findFirst({
        where: {
          from_id: post.user_id,
          to_id: BigInt(userId),
        },
      });

      if (BigInt(userId) != post.user_id && !isFriend) {
        return res.status(400).json({
          success: false,
          message: "You are not authorized to see this feed",
          error: null,
        });
      }

      return res.status(200).json({
        success: true,
        message: "Post fetched successfully",
        body: serializePost(post),
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to get post",
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
        body: {
          ...post,
          id: post.id.toString(),
          user_id: post.user_id.toString(),
        },
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
    const { trimmed } = req.body;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unathorized: User not logged in",
        error: null,
      });
    }

    if (!trimmed || trimmed.length > 280) {
      return res.status(400).json({
        success: false,
        message: "trimmed must not exceed 280 characters",
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

      if (post.user_id !== BigInt(userId)) {
        return res.status(403).json({
          success: false,
          message: "You are not authorized to edit this post",
          error: null,
        });
      }

      const updatedPost = await prisma.feed.update({
        where: { id: postIdBigInt },
        data: { content: trimmed },
      });

      return res.status(200).json({
        success: false,
        message: "Post updated successfully",
        body: serializePost(updatedPost),
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

      if (post.user_id !== BigInt(userId)) {
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
