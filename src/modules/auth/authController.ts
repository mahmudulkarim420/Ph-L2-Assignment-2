import { type Request, type Response, type NextFunction } from "express";
import { authService } from "./authService.js";
import { catchAsync } from "../../utils/catchAsync.js";
import { sendResponse } from "../../utils/sendResponse.js";

// Handles user registration

const signup = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password) {
    return sendResponse(res, {
      statusCode: 400,
      success: false,
      message: "name, email, and password are required",
    });
  }
  const newUser = await authService.signupUser(name, email, password, role);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "User registered successfully",
    data: newUser,
  });
});

// Handles user authentication and token generation

const login = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return sendResponse(res, {
      statusCode: 400,
      success: false,
      message: "email and password are required",
    });
  }
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
