import { Router } from "express";
import { authController } from "./authController.js";

const router = Router();

router.post("/signup", authController.signup);
router.post("/login", authController.login);

export const authRoute = router;
