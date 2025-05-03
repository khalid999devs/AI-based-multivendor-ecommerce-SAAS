import { AppError } from ".";
import { NextFunction, Request, Response } from "express";

export const errorMiddleWare = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof AppError) {
    console.log(`Error: ${req.method} ${req.url} - ${err.message}`);
    return res.status(err.statusCode).json({
      status: "error",
      message: err.message,
      ...(err.details && { details: err.details }),
    });
  } else {
    console.error(`Unhandled error: ${err.message}`);
    return res.status(500).json({
      error: "Something went wrong, please try again later",
    });
  }
};
