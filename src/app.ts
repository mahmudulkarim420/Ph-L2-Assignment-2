import express, { type Request, type Response } from "express";
import { authRoute } from "./modules/auth/authRoute";
import { issueRoute } from "./modules/issue/issueRoute";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());

app.get("/", (req: Request, res: Response) => {
  res.send("Hello DevPulse");
});


app.use("/api/auth", authRoute);
app.use("/api/issues", issueRoute);



export default app;
