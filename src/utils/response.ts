import type { Response } from "express";

export interface ApiResponse <T> {
  success: boolean;
  message: string;
  data?: T
};

export const sendResponse = <T> (
  res: Response,
  statusCode: number,
  message: string,
  success: boolean,
  data?: T
): Response<ApiResponse<T>> => {
  if (data) {
    return res.status(statusCode).json({
      success,
      message,
      data
    });
  }

  return res.status(statusCode).json({
    success,
    message
  });
};