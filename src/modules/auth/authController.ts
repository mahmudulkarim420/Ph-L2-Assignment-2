// modules/auth/authController.ts
import { type Request, type Response, type NextFunction } from "express";
import { authService } from "./authService.js";
import { catchAsync } from "../../utils/catchAsync.js";
import { sendResponse } from "../../utils/sendResponse.js";

// ১. Signup Controller
const signup = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { name, email, password, role } = req.body;

  const newUser = await authService.signupUser(name, email, password, role);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "User registered successfully",
    data: newUser,
  });
});

// ২. Login Controller
const login = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  const loginData = await authService.loginUser(email, password);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Login successful",
    data: loginData,
  });
});

export const authController = {
  signup,
  login,
};
