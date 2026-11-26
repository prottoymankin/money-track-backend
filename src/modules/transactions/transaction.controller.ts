import type { Request, Response } from "express";
import { AppError } from "../../utils/AppError";
import { sendResponse } from "../../utils/response";
import { transactionSchema } from "./transaction.schema";
import { transactionService } from "./transaction.service";

const addTransaction = async (req: Request, res: Response) => {
  try {
    const validationResult = transactionSchema.safeParse(req.body);

    if (!validationResult.success) {
      return sendResponse(res, 400, validationResult.error.issues[0]?.message || "Validation error", false);
    }

    const transaction = await transactionService.addTransaction(req, validationResult.data);

    sendResponse(res, 201, "Transaction added successfully", true, transaction);
  } catch (error: unknown) {
    if (error instanceof AppError) {
      return sendResponse(res, error.statusCode, error.message, false);
    }

    return sendResponse(res, 500, "Internal server error", false);
  }
};

export const transactionController = {
  addTransaction
};