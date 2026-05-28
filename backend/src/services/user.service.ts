import { prisma } from '../lib/prisma';
import { NotFoundError, ConflictError } from '../utils/errors';

export class UserService {
  async getProfile(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true,
        _count: { select: { todos: true } },
      },
    });

    if (!user) {
      throw new NotFoundError('User');
    }

    return user;
  }

  async updateProfile(userId: string, data: { name?: string; email?: string }) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundError('User');
    }

    if (data.email && data.email !== user.email) {
      const existing = await prisma.user.findUnique({
        where: { email: data.email },
      });
      if (existing) {
        throw new ConflictError('Email already in use');
      }
    }

    const updated = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.email && { email: data.email }),
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return updated;
  }
}

export const userService = new UserService();
