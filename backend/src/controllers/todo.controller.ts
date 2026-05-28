import { Response, NextFunction } from 'express';
import { todoService } from '../services';
import { AuthRequest } from '../types';
import { sendSuccess, sendSuccessWithPagination } from '../utils/apiResponse';
import { asyncHandler } from '../utils/asyncHandler';

export const createTodo = asyncHandler(
  async (req: AuthRequest, res: Response, _next: NextFunction) => {
    const todo = await todoService.create(req.user!.userId, req.body);
    sendSuccess(res, todo, 'Todo created successfully', 201);
  }
);

export const getTodos = asyncHandler(
  async (req: AuthRequest, res: Response, _next: NextFunction) => {
    const result = await todoService.findAll(req.user!.userId, req.query as any);
    sendSuccessWithPagination(res, result.todos, result.meta);
  }
);

export const getTodo = asyncHandler(
  async (req: AuthRequest, res: Response, _next: NextFunction) => {
    const todo = await todoService.findById(req.user!.userId, req.params.id);
    sendSuccess(res, todo);
  }
);

export const updateTodo = asyncHandler(
  async (req: AuthRequest, res: Response, _next: NextFunction) => {
    const todo = await todoService.update(req.user!.userId, req.params.id, req.body);
    sendSuccess(res, todo, 'Todo updated successfully');
  }
);

export const deleteTodo = asyncHandler(
  async (req: AuthRequest, res: Response, _next: NextFunction) => {
    await todoService.delete(req.user!.userId, req.params.id);
    sendSuccess(res, null, 'Todo deleted successfully');
  }
);

export const toggleTodo = asyncHandler(
  async (req: AuthRequest, res: Response, _next: NextFunction) => {
    const todo = await todoService.toggle(req.user!.userId, req.params.id);
    sendSuccess(res, todo, `Todo marked as ${todo.completed ? 'completed' : 'incomplete'}`);
  }
);

export const toggleImportantTodo = asyncHandler(
  async (req: AuthRequest, res: Response, _next: NextFunction) => {
    const todo = await todoService.toggleImportant(req.user!.userId, req.params.id);
    sendSuccess(res, todo, `Todo marked as ${todo.important ? 'important' : 'not important'}`);
  }
);

export const getTodoStats = asyncHandler(
  async (req: AuthRequest, res: Response, _next: NextFunction) => {
    const stats = await todoService.getStats(req.user!.userId);
    sendSuccess(res, stats);
  }
);
