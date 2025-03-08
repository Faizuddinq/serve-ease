"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config = require("../config/config");
// Global Error Handler Middleware
const globalErrorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    return res.status(statusCode).json({
        status: statusCode,
        message: err.message || "Internal Server Error",
        errorStack: config.nodeEnv === "development" ? err.stack : "",
    });
};
module.exports = globalErrorHandler;
//# sourceMappingURL=globalErrorHandler.js.map