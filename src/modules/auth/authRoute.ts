import { Router } from "express";
import { authController } from "./authController.js";

const router = Router();

// Authentication routes
// POST /signup - Register new user
// POST /login - Authenticate user
 
router.post("/signup", authController.signup);
router.post("/login", authController.login);

export const authRoute = router;
