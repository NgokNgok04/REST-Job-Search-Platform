import { PrismaClient } from "@prisma/client";

class Connection {
  private static prisma = new PrismaClient();

  static async getTotalConnection(id: number) {
    return await Connection.prisma.connection.count({
      where: {
        from_id: id,
      },
    });
  }
}

export default Connection;
