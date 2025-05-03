export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly details?: any;

  constructor(
    message: string,
    statusCode: number,
    isOperational = true,
    details?: any
  ) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.details = details;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = "Resources not found", details?: any) {
    super(message, 404);
  }
}

// validation error (use for joi/zod/react-hook-form validation errors)
export class ValidationError extends AppError {
  constructor(message: string = "Invalid Request Data", details?: any) {
    super(message, 400, true, details);
  }
}

// Authentication error
export class AuthError extends AppError {
  constructor(message: string = "Unauthorized") {
    super(message, 401);
  }
}

// Forbidden Error
export class ForbiddenError extends AppError {
  constructor(message: string = "Forbidden access") {
    super(message, 403);
  }
}

// database error (For MongoDb/ Postgress Errors)
export class DatabaseError extends AppError {
  constructor(message: string = "Database Error", details?: any) {
    super(message, 500, true, details);
  }
}

// Rate limit error
export class RateLimitError extends AppError {
  constructor(message: string = "Too many requests, please try again later") {
    super(message, 429);
  }
}
