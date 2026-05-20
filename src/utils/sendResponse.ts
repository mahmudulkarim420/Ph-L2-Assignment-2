import type { Response } from "express";

type ResponseData<T> = {
  statusCode: number;
  success: boolean;
  message: string;
  data?: T;
  errors?: unknown;
};

// Standardized response formatter for API endpoints
export const sendResponse = <T>(res: Response, data: ResponseData<T>) => {
  const responsePayload: Record<string, unknown> = {
    success: data.success,
    message: data.message,
  };

  if (data.success) {
    responsePayload.data = data.data !== undefined ? data.data : null;
  } else {
    responsePayload.errors = data.errors !== undefined ? data.errors : null;
  }

  res.status(data.statusCode).json(responsePayload);
};
