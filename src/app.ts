import express, { type Request, type Response } from "express";
import { authRoute } from "./modules/auth/authRoute.js";
import { issueRoute } from "./modules/issue/issueRoute.js";
import cors from "cors";
import { globalErrorHandler } from "./middleware/errorHandler.js";

// Express application configuration
const app = express();

// Middleware setup
app.use(express.json());
app.use(cors());

// Health check endpoint
app.get("/", (req: Request, res: Response) => {
  res.send("Hello DevPulse");
});

// API routes
app.use("/api/auth", authRoute);
app.use("/api/issues", issueRoute);

// Global error handler
app.use(globalErrorHandler);

export default app;
