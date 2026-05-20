import { type Request } from "express";

// JWT token payload structure

export interface JwtPayload {
  id: number;
  name: string;
  role: string;
}

// Extended Express request with authenticated user data

export interface AuthRequest extends Request {
  user?: JwtPayload;
}
