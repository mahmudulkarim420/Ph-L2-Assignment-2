import type { Response, NextFunction } from "express";
import type { AuthRequest } from "../interfaces/authInterface.js";
import { sendResponse } from "../utils/sendResponse.js";

// Middleware to restrict access based on user roles
 
export const requireRole = (allowedRoles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    const user = req.user;

    if (!user) {
      sendResponse(res, {
        statusCode: 401,
        success: false,
        message: "Unauthorized",
        errors: "User not authenticated",
      });
      return;
    }

    if (!allowedRoles.includes(user.role)) {
      sendResponse(res, {
        statusCode: 403,
        success: false,
        message: "Forbidden",
        errors: "Valid token but insufficient role/permissions",
      });
      return;
    }

    next();
  };
};
