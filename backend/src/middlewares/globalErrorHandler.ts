const config = require("../config/config");
import { Request, Response, NextFunction } from "express";

// Global Error Handler Middleware
const globalErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  const statusCode: number = err.statusCode || 500;

  return res.status(statusCode).json({
    status: statusCode,
    message: err.message || "Internal Server Error",
    errorStack: config.nodeEnv === "development" ? err.stack : "",
  });
};

module.exports = globalErrorHandler;
