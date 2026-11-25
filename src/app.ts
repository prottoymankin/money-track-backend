import express, { Application, Request, Response } from "express";
import { authRoutes } from "./modules/auth/auth.route";

const app: Application = express();

app.use(express.json());

app.use("/api/v1/auth", authRoutes);

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "Server is running successfully."
  });
});

export default app;