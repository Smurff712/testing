import { Response, NextFunction } from 'express';
import { userService } from '../services';
import { AuthRequest } from '../types';
import { sendSuccess } from '../utils/apiResponse';
import { asyncHandler } from '../utils/asyncHandler';

export const getProfile = asyncHandler(
  async (req: AuthRequest, res: Response, _next: NextFunction) => {
    const profile = await userService.getProfile(req.user!.userId);
    sendSuccess(res, profile);
  }
);

export const updateProfile = asyncHandler(
  async (req: AuthRequest, res: Response, _next: NextFunction) => {
    const updated = await userService.updateProfile(req.user!.userId, req.body);
    sendSuccess(res, updated, 'Profile updated successfully');
  }
);
