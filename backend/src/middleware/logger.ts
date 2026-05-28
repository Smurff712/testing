import { Request, Response, NextFunction } from 'express';
import { config } from '../config';

export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (config.env !== 'development') {
    next();
    return;
  }

  const start = Date.now();
  const { method, url } = req;

  res.on('finish', () => {
    const duration = Date.now() - start;
    const { statusCode } = res;
    console.log(`${method} ${url} ${statusCode} ${duration}ms`);
  });

  next();
};
