import { Prisma, Priority } from '@prisma/client';
import { prisma } from '../lib/prisma';
import { NotFoundError, ForbiddenError } from '../utils/errors';
import { parsePagination } from '../utils/helpers';

export class TodoService {
  async create(userId: string, data: {
    title: string;
    description?: string;
    important?: boolean;
    priority?: Priority;
    dueDate?: string;
  }) {
    const todo = await prisma.todo.create({
      data: {
        title: data.title,
        description: data.description,
        important: data.important ?? false,
        priority: data.priority ?? Priority.MEDIUM,
        dueDate: data.dueDate ? new Date(data.dueDate) : null,
        userId,
      },
      include: { user: { select: { id: true, name: true, email: true } } },
    });
    return todo;
  }

  async findAll(userId: string, query: {
    page?: number;
    limit?: number;
    completed?: boolean;
    important?: boolean;
    priority?: Priority;
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }) {
    const { page, limit, skip } = parsePagination(query);

    const where: Prisma.TodoWhereInput = { userId };

    if (query.completed !== undefined) {
      where.completed = query.completed;
    }

    if (query.important !== undefined) {
      where.important = query.important;
    }

    if (query.priority) {
      where.priority = query.priority;
    }

    if (query.search) {
      where.OR = [
        { title: { contains: query.search, mode: 'insensitive' } },
        { description: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    const orderBy: Prisma.TodoOrderByWithRelationInput = {};
    const sortField = query.sortBy || 'createdAt';
    const sortOrder = query.sortOrder || 'desc';

    if (sortField === 'priority') {
      orderBy.priority = sortOrder;
    } else {
      (orderBy as Record<string, string>)[sortField] = sortOrder;
    }

    const [todos, total] = await Promise.all([
      prisma.todo.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: { user: { select: { id: true, name: true, email: true } } },
      }),
      prisma.todo.count({ where }),
    ]);

    return {
      todos,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findById(userId: string, todoId: string) {
    const todo = await prisma.todo.findUnique({
      where: { id: todoId },
      include: { user: { select: { id: true, name: true, email: true } } },
    });

    if (!todo) {
      throw new NotFoundError('Todo');
    }

    if (todo.userId !== userId) {
      throw new ForbiddenError('You can only access your own todos');
    }

    return todo;
  }

  async update(userId: string, todoId: string, data: {
    title?: string;
    description?: string | null;
    completed?: boolean;
    important?: boolean;
    priority?: Priority;
    dueDate?: string | null;
  }) {
    await this.findById(userId, todoId);

    const updateData: Prisma.TodoUpdateInput = {};
    if (data.title !== undefined) updateData.title = data.title;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.completed !== undefined) updateData.completed = data.completed;
    if (data.important !== undefined) updateData.important = data.important;
    if (data.priority !== undefined) updateData.priority = data.priority;
    if (data.dueDate !== undefined) {
      updateData.dueDate = data.dueDate ? new Date(data.dueDate) : null;
    }

    const todo = await prisma.todo.update({
      where: { id: todoId },
      data: updateData,
      include: { user: { select: { id: true, name: true, email: true } } },
    });

    return todo;
  }

  async delete(userId: string, todoId: string) {
    await this.findById(userId, todoId);

    await prisma.todo.delete({ where: { id: todoId } });
  }

  async toggle(userId: string, todoId: string) {
    const todo = await this.findById(userId, todoId);

    const updated = await prisma.todo.update({
      where: { id: todoId },
      data: { completed: !todo.completed },
      include: { user: { select: { id: true, name: true, email: true } } },
    });

    return updated;
  }

  async toggleImportant(userId: string, todoId: string) {
    const todo = await this.findById(userId, todoId);

    const updated = await prisma.todo.update({
      where: { id: todoId },
      data: { important: !todo.important },
      include: { user: { select: { id: true, name: true, email: true } } },
    });

    return updated;
  }

  async getStats(userId: string) {
    const [total, completed, important, highPriority] = await Promise.all([
      prisma.todo.count({ where: { userId } }),
      prisma.todo.count({ where: { userId, completed: true } }),
      prisma.todo.count({ where: { userId, important: true } }),
      prisma.todo.count({ where: { userId, priority: Priority.HIGH } }),
    ]);

    return { total, completed, important, highPriority };
  }
}

export const todoService = new TodoService();
