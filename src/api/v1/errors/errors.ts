export class AppError extends Error {
    public statusCode: number;
    public code: string;

    constructor(message: string, code: string, statusCode: number) {
        super(message);
        this.code = code;
        this.statusCode = statusCode;
        Object.setPrototypeOf(this, new.target.prototype);
        Error.captureStackTrace(this);
    }
}
export class BadRequestError extends AppError {
    constructor(message = "Bad Request", code = "BAD_REQUEST") {
        super(message, code, 400);
    }
}
export class AuthenticationError extends AppError {
    constructor(message = "Unauthorized", code = "UNAUTHORIZED") {
        super(message, code, 401);
    }
}
export class AuthorizationError extends AppError {
    constructor(message = "Forbidden", code = "FORBIDDEN") {
        super(message, code, 403);
    }
}
export class NotFoundError extends AppError {
    constructor(message = "Not Found", code = "NOT_FOUND") {
        super(message, code, 404);
    }
}
export class ConflictError extends AppError {
    constructor(message = "Conflict", code = "CONFLICT") {
        super(message, code, 409);
    }
}
export class ServiceError extends AppError {
    constructor(message = "Internal Server Error", code = "INTERNAL_SERVER_ERROR") {
        super(message, code, 500);
    }
}