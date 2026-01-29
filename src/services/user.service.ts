import type { UserModel } from '@/graphql/models/user.model.js';
import { prismaClient } from '@/lib/prisma.js';

export class UserService {
  async getUser(id: string): Promise<UserModel> {
    const user = await prismaClient.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new Error('User not found');
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
