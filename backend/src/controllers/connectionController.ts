import { Request, Response } from "express";
import { prisma } from "../prisma";
import { serializeUsers } from "./userController";
import { error } from "console";

const serializeConnectionAndRequest = (connection: any | any[]) => {
  const connections = Array.isArray(connection) ? connection : [connection];

  return connections.map((conn) => ({
    ...conn,
    from_id: conn.from_id.toString(),
    to_id: conn.to_id.toString(),
    created_at: conn.created_at.toISOString(),
  }));
};

export const ConnectionController = {
  sendConnectionRequest: async (req: Request, res: Response) => {
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: Missing userId",
        error: null,
      });
    }

    const loggedUser = BigInt(req.user.id);
    const { to_id } = req.body;

    if (!to_id || isNaN(Number(to_id))) {
      return res.status(400).json({
        success: false,
        message: "Invalid or missing 'to_id' parameter",
        error: null,
      });
    }

    if (loggedUser === BigInt(to_id)) {
      return res.status(400).json({
        success: false,
        message: "You cannot connect to yourself",
        error: null,
      });
    }

    try {
      const existingConnection = await prisma.connection.findFirst({
        where: { from_id: loggedUser, to_id: BigInt(to_id) },
      });

      if (existingConnection) {
        return res.status(400).json({
          success: false,
          message: "Connection already exists",
          error: null,
        });
      }

      const request = await prisma.connectionRequest.create({
        data: {
          from_id: loggedUser,
          to_id: BigInt(to_id),
          created_at: new Date(),
        },
      });

      res.status(201).json({
        success: true,
        message: "Connection request sent successfully",
        error: null,
        body: serializeConnectionAndRequest(request),
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to send connection request",
        error:
          error instanceof Error
            ? { code: "SERVER_ERROR", details: error.message }
            : null,
      });
    }
  },

  getPendingRequests: async (req: Request, res: Response) => {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized: Missing userId" });
    }

    const loggedUser = BigInt(req.user.id);

    try {
      const requests = await prisma.connectionRequest.findMany({
        where: { to_id: loggedUser },
        orderBy: { created_at: "desc" },
      });

      res.status(200).json(serializeConnectionAndRequest(requests));
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch connection requests." });
    }
  },

  respondToRequest: async (req: Request, res: Response) => {
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: Missing userId",
        error: null,
      });
    }

    const loggedUser = BigInt(req.user.id);
    const { to_id, action } = req.body; // action: "accept" | "reject"

    if (!action || !["accept", "reject"].includes(action)) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid 'action' parameter. Allowed values: 'accept' or 'reject'",
        error: null,
      });
    }

    if (!to_id || isNaN(Number(to_id))) {
      return res.status(400).json({
        success: false,
        message: "Invalid or missing 'to_id' parameter",
        error: null,
      });
    }
    const toIdBigInt = BigInt(to_id);

    try {
      const request = await prisma.connectionRequest.findFirst({
        where: { from_id: loggedUser, to_id: toIdBigInt },
      });

      if (!request) {
        return res
          .status(404)
          .json({ success: false, message: "Request not found.", error: null });
      }

      if (action === "accept") {
        await prisma.$transaction(async (tx) => {
          await tx.connection.createMany({
            data: [
              {
                from_id: loggedUser,
                to_id: toIdBigInt,
                created_at: new Date(),
              },
              {
                from_id: toIdBigInt,
                to_id: loggedUser,
                created_at: new Date(),
              },
            ],
          });

          await tx.connectionRequest.delete({
            where: {
              from_id_to_id: { from_id: loggedUser, to_id: toIdBigInt },
            },
          });
        });
      } else {
        // action === "reject"
        await prisma.connectionRequest.delete({
          where: {
            from_id_to_id: { from_id: loggedUser, to_id: toIdBigInt },
          },
        });
      }

      res.status(200).json({
        success: true,
        message: "Request processed successfully.",
        body: null,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to process connection request.",
        error:
          error instanceof Error
            ? { code: "SERVER_ERROR", details: error.message }
            : null,
      });
    }
  },

  unconnectConnection: async (req: Request, res: Response) => {
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: Missing userId",
        error: null,
      });
    }

    const loggedUser = BigInt(req.user.id);
    const { to_id } = req.body;

    if (!to_id || isNaN(Number(to_id))) {
      return res.status(400).json({
        success: false,
        message: "Invalid or missing 'to_id' parameter",
        error: null,
      });
    }

    const toIdBigInt = BigInt(to_id);

    try {
      const request = await prisma.connection.findFirst({
        where: { from_id: loggedUser, to_id: toIdBigInt },
      });

      if (!request) {
        return res.status(404).json({
          success: false,
          message:
            "Connection not found. You have to connect first to unconnect",
          error: null,
        });
      }

      await prisma.$transaction([
        prisma.connection.delete({
          where: {
            from_id_to_id: { from_id: loggedUser, to_id: toIdBigInt },
          },
        }),
        prisma.connection.delete({
          where: {
            from_id_to_id: { from_id: toIdBigInt, to_id: loggedUser },
          },
        }),
      ]);

      res.status(200).json({ message: "Connection unconnected successfully." });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to unconnect connections",
        error:
          error instanceof Error
            ? { code: "SERVER_ERROR", details: error.message }
            : null,
      });
    }
  },

  getConnections: async (req: Request, res: Response) => {
    const { user_id } = req.query;

    if (!user_id || typeof user_id !== "string" || isNaN(Number(user_id))) {
      return res.status(400).json({
        success: false,
        message: "Invalid or missing 'user_id' parameter",
      });
    }

    const userId = BigInt(user_id);
    try {
      const connections = await prisma.connection.findMany({
        where: { from_id: userId },
        include: {
          To: {
            select: {
              id: true,
              username: true,
              full_name: true,
              profile_photo_path: true,
            },
          },
        },
      });

      res.status(200).json({
        success: true,
        message: "Connections fetched successfully",
        body: connections.map((connection) => ({
          id: connection.To.id.toString(),
          username: connection.To.username,
          full_name: connection.To.full_name || "N/A",
          profile_photo_path: connection.To.profile_photo_path || null,
        })),
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to fetch connections",
        error:
          error instanceof Error
            ? { code: "SERVER_ERROR", details: error.message }
            : null,
      });
    }
  },
};
