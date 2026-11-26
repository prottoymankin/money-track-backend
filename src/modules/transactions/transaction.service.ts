import { pool } from "../../db/database";
import { AppError } from "../../utils/AppError";
import { Transaction } from "./transaction.interface";
import { CreateTransaction } from "./transaction.schema";
import type { Request } from "express"; 

const addTransaction = async (req: Request, payload: CreateTransaction) => {
  const { type, amount, description } = payload;
  
  const queryResult = await pool.query<Transaction>(`
    INSERT INTO transactions (user_id, type, amount, description)
    VALUES ($1, $2, $3, $4)
    RETURNING *
  `, [req.user?.id, type, amount, description || null]);

  const transaction = queryResult.rows[0];

  if (!transaction) {
    throw new AppError(500, "Failed to create transaction");
  }

  return transaction;
};

export const transactionService = {
  addTransaction
};