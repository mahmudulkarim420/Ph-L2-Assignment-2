import type { Request, Response, NextFunction } from "express";

// Wraps async route handlers to catch errors and pass to error middleware
 
export const catchAsync = <T extends Request>(
  fn: (req: T, res: Response, next: NextFunction) => Promise<unknown>,
) => {
  return (req: T, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
