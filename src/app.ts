import express, { type Request, type Response } from "express";
import { authRoute } from "./modules/auth/authRoute.js";
import { issueRoute } from "./modules/issue/issueRoute.js";
import cors from "cors";
import { globalErrorHandler } from "./middleware/errorHandler.js";

const app = express();
app.use(express.json());
app.use(cors());

app.get("/", (req: Request, res: Response) => {
  res.send("Hello DevPulse");
});

app.use("/api/auth", authRoute);
app.use("/api/issues", issueRoute);
app.use(globalErrorHandler);
export default app;
