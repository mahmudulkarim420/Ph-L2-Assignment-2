import type { Request, Response, NextFunction } from "express";

export const globalErrorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.error("Global Error Caught:", err.message);

  res.status(500).json({
    success: false,
    message: "Internal Server Error",
    errors: err.message || "An unexpected error occurred",
  });
};
