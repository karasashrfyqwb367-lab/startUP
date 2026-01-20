export class ExpcationError extends Error {
    constructor(message, statusCode, cause) {
        super(message, { cause });
        this.message = message;
        this.statusCode = statusCode;
        this.cause = cause;
        this.name = this.constructor.name;
        this.statusCode = statusCode;
    }
}
export class BedReqExpation extends ExpcationError {
    constructor(message, cause) {
        super(message, 400, cause);
    }
}
export class NotFountExpcation extends ExpcationError {
    constructor(message, cause) { super(message, 404, cause); }
}

export class confictExpcaption extends ExpcationError {
    constructor(message, cause) { super(message, 409, cause); }
}

export const globalErrorHandeling = ((error, req, res, next) => {
    if (error instanceof SyntaxError && error.status === 400 && 'body' in error) {
        return res.status(400).json({
            err_message: "Invalid JSON format. Please check that your request body is valid JSON (e.g., uses double quotes for strings and keys).",
            error: error.message
        });
    }
    // Handle Mongoose Validation Errors
    if (error.name === 'ValidationError') {
        const issues = Object.values(error.errors).map(err => err.message);
        return res.status(400).json({
            err_message: "Validation Error",
            issues
        });
    }

    // Handle Mongoose Duplicate Key Errors
    if (error.code === 11000) {
        const field = Object.keys(error.keyPattern || {})[0] || 'field';
        return res.status(409).json({
            err_message: `Already exists: ${field}`,
            field
        });
    }

    return res.status(error.statusCode || 500).json({
        err_message: error.message || "server Error",
        stack: process.env.MOOD === "development" ? error.stack : undefined
    });
});
