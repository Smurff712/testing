import { Response, NextFunction } from 'express';
import { authService } from '../services';
import { AuthRequest } from '../types';
import { sendSuccess } from '../utils/apiResponse';
import { asyncHandler } from '../utils/asyncHandler';

export const register = asyncHandler(
  async (req: AuthRequest, res: Response, _next: NextFunction) => {
    const { name, email, password } = req.body;
    const result = await authService.register(name, email, password);
    sendSuccess(res, result, 'User registered successfully', 201);
  }
);

export const login = asyncHandler(
  async (req: AuthRequest, res: Response, _next: NextFunction) => {
    const { email, password } = req.body;
    const result = await authService.login(email, password);
    sendSuccess(res, result, 'Login successful');
  }
);

export const getMe = asyncHandler(
  async (req: AuthRequest, res: Response, _next: NextFunction) => {
    const user = await authService.getCurrentUser(req.user!.userId);
    sendSuccess(res, user);
  }
);
