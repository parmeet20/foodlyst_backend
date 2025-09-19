import { Response } from "express";

interface ErrorOptions {
    message?: string;
    statusCode?: number;
    error?: any;
    includeStack?: boolean;
}

export const handleErrorResponse = (
    res: Response,
    {
        message = "Something went wrong",
        statusCode = 500,
        error,
        includeStack = false,
    }: ErrorOptions
) => {
    console.error("❌ Error:", message, error?.message || error);

    return res.status(statusCode).json({
        success: false,
        message,
        ...(includeStack && error?.stack ? { stack: error.stack } : {}),
    });
};
