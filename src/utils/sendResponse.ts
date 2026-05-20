import type { Response } from "express";

type ResponseData<T> = {
  statusCode: number;
  success: boolean;
  message: string;
  data?: T;
  errors?: unknown;
};

export const sendResponse = <T>(res: Response, data: ResponseData<T>) => {
  res.status(data.statusCode).json({
    success: data.success,
    message: data.message,
    ...(data.data !== undefined && { data: data.data }),
    ...(data.errors !== undefined && { errors: data.errors }),
  });
};
