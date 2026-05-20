// modules/auth/authController.ts
import { type Request, type Response } from "express";
import { authService } from "./authService.js";

// ১. Signup Controller
const signup = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role } = req.body;

    const newUser = await authService.signupUser(name, email, password, role);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: newUser,
    });
  } catch (error: any) {
    // Duplicate Email Error Handle
    if (error.code === "23505") {
      res.status(400).json({
        success: false,
        message: "Email already exists",
        errors: error.detail,
      });
      return;
    }
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      errors: error.message,
    });
  }
};

// ২. Login Controller
const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const loginData = await authService.loginUser(email, password);

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: loginData,
    });
  } catch (error: any) {
    // Invalid Credentials Error Handle
    if (error.message === "INVALID_CREDENTIALS") {
      res.status(401).json({
        success: false,
        message: "Invalid email or password",
        errors: "Authentication failed",
      });
      return;
    }
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      errors: error.message,
    });
  }
};

export const authController = {
  signup,
  login,
};
