import type { NextFunction, Request, Response } from "express";
import { sendResponse } from "../utils/response";
import jwt, { JwtPayload } from "jsonwebtoken";
import { pool } from "../db/database";
import { User } from "../modules/users/user.interface";

const verifyUser = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization;

  if (!token) {
    return sendResponse(res, 401, "Unauthorized", false);
  }
  
  try {
    const decode = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;

    const { id, email } = decode;

    const queryResult = await pool.query<User>(`
      SELECT * FROM users
      WHERE id = $1 AND email = $2
    `, [id, email]);

    const user = queryResult.rows[0];

    if (!user) {
      return sendResponse(res, 404, "User not found", false);
    }

    req.user = {
      id: user.id,
      email: user.email
    };
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return sendResponse(res, 401, error.message, false);
    }

    return sendResponse(res, 401, "Invalid or expired token", false);
  }

  next();
};

export const authenticateMiddleware = {
  verifyUser
};