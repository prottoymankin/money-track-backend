import type { Request, Response } from "express";
import { loginSchema, registerSchema } from "./auth.schema";
import { sendResponse } from "../../utils/response";
import { authService } from "./auth.service";
import { AppError } from "../../utils/AppError";

const register = async (req: Request, res: Response) => {
  try {
    const validationResult = registerSchema.safeParse(req.body);
  
    if (!validationResult.success) {
      return sendResponse(
        res, 400,
        validationResult.error.issues[0]?.message || "Validation error",
        false
      );
    }
  
    const { accessToken, refreshToken, safeUser } = await authService.register(validationResult.data);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });

    return sendResponse(
      res, 201, "User created successfully", true, 
      { user: safeUser, token: accessToken }
    );
  } catch (error: unknown) {
    if (error instanceof AppError) {
      return sendResponse(res, error.statusCode, error.message, false);
    }

    return sendResponse(res, 500, "Internal server error", false);
  }
};

const login = async (req: Request, res: Response) => {
  try {
    const validationResult = loginSchema.safeParse(req.body);

    if (!validationResult.success) {
      return sendResponse(
        res, 400,
        validationResult.error.issues[0]?.message || "Validation error",
        false
      );
    }

    const { accessToken, refreshToken, safeUser } = await authService.login(validationResult.data);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });

    return sendResponse(
      res, 200, "User logged in successfully", true, 
      { user: safeUser, token: accessToken }
    );
    
  } catch (error: unknown) {
    if (error instanceof AppError) {
      return sendResponse(res, error.statusCode, error.message, false);
    }

    return sendResponse(res, 500, "Internal server error", false);
  }
}

export const authController = {
  register,
  login
};