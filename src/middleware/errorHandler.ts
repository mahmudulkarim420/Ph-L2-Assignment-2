import type { Request, Response, NextFunction } from "express";
import { sendResponse } from "../utils/sendResponse.js";

interface CustomError extends Error {
  code?: string;
}

export const globalErrorHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.error("Global Error Caught:", err.message);

  let statusCode = 500;
  let message = "Internal Server Error";
  let errors: unknown = "An unexpected error occurred";

  if (err.code === "23505") {
    statusCode = 400;
    message = "Email already exists";
    errors = "Duplicate key violation";
  } else if (err.message === "INVALID_CREDENTIALS") {
    statusCode = 401;
    message = "Invalid email or password";
    errors = "Authentication failed";
  }

  sendResponse(res, {
    statusCode,
    success: false,
    message,
    errors,
  });
};
