import { PrismaClient } from "@prisma/client";
class User {
  private static prisma = new PrismaClient();

  static async getUser(id: number) {
    return await User.prisma.user.findUnique({
      where: {
        id: id,
      },
    });
  }

  static async getPosts(id: number) {
    const Posts = await User.prisma.feed.findMany({
      where: {
        user_id: id,
      },
      take: 10,
    });

    return Posts.map((post) => ({
      id: post.id,
      content: post.content,
      created_at: post.created_at.toString(),
      updated_at: post.updated_at.toString(),
      user_id: id,
    }));
  }

  static async isConnected(from_id: number, to_id: number) {
    return !!(await User.prisma.connection.findUnique({
      where: {
        from_id_to_id: {
          from_id: from_id,
          to_id: to_id,
        },
      },
    }));
  }
}

export default User;
