import { Router } from "express";
import { transactionController } from "./transaction.controller";
import { authenticateMiddleware } from "../../middlewares/authenticate.middleware";

const router = Router();

router.post("/", authenticateMiddleware.verifyUser, transactionController.addTransaction);

export const transactionRoute = router;