import { type Response, type NextFunction } from "express";
import jwt from "jsonwebtoken";
import config from "../config/index.js";
import type { AuthRequest, JwtPayload } from "../interfaces/authInterface.js";

export const verifyToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized: No token provided",
    });
  }

  try {
    const decoded = jwt.verify(token, config.jwt_secret as string) as JwtPayload;

    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized: Invalid or expired token",
    });
  }
};
