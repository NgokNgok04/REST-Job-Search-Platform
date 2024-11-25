import { Request, Response } from "express";
import { prisma } from "../prisma";
import { serializeUsers } from "./userController";

const serializeConnectionAndRequest = (connection: any | any[]) => {
  const connections = Array.isArray(connection) ? connection : [connection];

  return connections.map((conn) => ({
    ...conn,
    from_id: conn.from_id.toString(),
    to_id: conn.to_id.toString(),
    created_at: conn.created_at.toISOString(),
  }));
};

export const sendConnectionRequest = async (req: Request, res: Response) => {
  const { from_id, to_id } = req.body;

  if (!from_id || isNaN(Number(from_id))) {
    return res
      .status(400)
      .json({ error: "Invalid or missing 'from_id' parameter" });
  }

  if (!to_id || isNaN(Number(to_id))) {
    return res
      .status(400)
      .json({ error: "Invalid or missing 'to_id' parameter" });
  }

  const fromIdBigInt = BigInt(from_id);
  const toIdBigInt = BigInt(to_id);

  if (fromIdBigInt === toIdBigInt) {
    return res.status(400).json({ error: "Trying to connect to yourself(?)" });
  }

  try {
    const existingConnection = await prisma.connection.findFirst({
      where: { from_id: fromIdBigInt, to_id: toIdBigInt },
    });

    if (existingConnection) {
      return res.status(400).json({ error: "Connection already exist " });
    }

    const existingRequest = await prisma.connectionRequest.findFirst({
      where: { from_id: fromIdBigInt, to_id: toIdBigInt },
    });

    if (existingRequest) {
      return res
        .status(400)
        .json({ error: "Connection Request already exist " });
    }

    const reverseRequest = await prisma.connectionRequest.findFirst({
      where: { from_id: toIdBigInt, to_id: fromIdBigInt },
    });

    if (reverseRequest) {
      return res
        .status(400)
        .json({ error: "There is already connection request from that user" });
    }

    const request = await prisma.connectionRequest.create({
      data: {
        from_id: fromIdBigInt,
        to_id: toIdBigInt,
        created_at: new Date(),
      },
    });

    res.status(201).json(serializeConnectionAndRequest(request));
  } catch (error) {
    res
      .status(500)
      .json({
        error: error instanceof Error ? error.message : "Unknown error",
      });
  }
};

export const getPendingRequests = async (req: Request, res: Response) => {
  const userIdParam = req.params.userId;

  if (!userIdParam || isNaN(Number(userIdParam))) {
    return res
      .status(400)
      .json({ error: "Invalid or missing userId parameter" });
  }

  const userId = BigInt(userIdParam);

  try {
    const requests = await prisma.connectionRequest.findMany({
      where: { from_id: userId },
      orderBy: { created_at: "desc" },
    });

    res.status(200).json(serializeConnectionAndRequest(requests));
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch connection requests." });
  }
};

export const respondToRequest = async (req: Request, res: Response) => {
  const { from_id, to_id, action } = req.body; // action: "accept" | "reject"

  if (!from_id || isNaN(Number(from_id))) {
    return res
      .status(400)
      .json({ error: "Invalid or missing 'from_id' parameter" });
  }

  if (!to_id || isNaN(Number(to_id))) {
    return res
      .status(400)
      .json({ error: "Invalid or missing 'to_id' parameter" });
  }

  if (!action || !["accept", "reject"].includes(action)) {
    return res
      .status(400)
      .json({
        error:
          "Invalid 'action' parameter. Allowed values: 'accept' or 'reject'",
      });
  }

  const fromIdBigInt = BigInt(from_id);
  const toIdBigInt = BigInt(to_id);

  try {
    const request = await prisma.connectionRequest.findFirst({
      where: { from_id: fromIdBigInt, to_id: toIdBigInt },
    });

    if (!request) {
      return res.status(404).json({ error: "Request not found." });
    }

    if (action === "accept") {
      await prisma.$transaction(async (tx) => {
        await tx.connection.createMany({
          data: [
            {
              from_id: fromIdBigInt,
              to_id: toIdBigInt,
              created_at: new Date(),
            },
            {
              from_id: toIdBigInt,
              to_id: fromIdBigInt,
              created_at: new Date(),
            },
          ],
        });

        await tx.connectionRequest.delete({
          where: {
            from_id_to_id: { from_id: fromIdBigInt, to_id: toIdBigInt },
          },
        });
      });
    } else {
      // action === "reject"
      await prisma.connectionRequest.delete({
        where: { from_id_to_id: { from_id: fromIdBigInt, to_id: toIdBigInt } },
      });
    }

    res.status(200).json({ message: "Request processed successfully." });
  } catch (error) {
    res.status(500).json({ error: "Failed to process connection request." });
  }
};

export const getConnections = async (req: Request, res: Response) => {
  const userIdParam = req.params.userId;

  if (!userIdParam || isNaN(Number(userIdParam))) {
    return res
      .status(400)
      .json({ error: "Invalid or missing userId parameter" });
  }

  const userId = BigInt(userIdParam);

  try {
    const connections = await prisma.connection.findMany({
      where: { from_id: userId },
      include: {
        To: true,
      },
    });

    res.status(200).json(serializeUsers(connections.map((c) => c.To)));
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
