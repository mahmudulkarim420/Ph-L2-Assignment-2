// middleware/roleMiddleware.ts
import type { Response, NextFunction } from "express";
import type { AuthRequest } from "../interfaces/authInterface.js";

export const requireRole = (allowedRoles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    const user = req.user;

    if (!user) {
      res.status(401).json({
        success: false,
        message: "Unauthorized",
        errors: "User not authenticated",
      });
      return;
    }

    if (!allowedRoles.includes(user.role)) {
      res.status(403).json({
        success: false,
        message: "Forbidden",
        errors: "Valid token but insufficient role/permissions",
      });
      return;
    }

    next();
  };
};
