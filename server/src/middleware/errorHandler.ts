import { Request, Response, NextFunction } from "express";

const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack); // Log the stack trace for debugging

    // Check if the error has a status code; if not, default to 500
    const statusCode = err.statusCode || 500;

    // Send the response with the appropriate status code and message
    res.status(statusCode).json({
        message: "Something went wrong!",
        error: err.message || "Internal Server Error"
    });
};

export default errorHandler;
