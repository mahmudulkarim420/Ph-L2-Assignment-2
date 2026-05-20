import type { Request, Response, NextFunction } from "express";

export const catchAsync = <T extends Request>(
  fn: (req: T, res: Response, next: NextFunction) => Promise<unknown>,
) => {
  return (req: T, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
