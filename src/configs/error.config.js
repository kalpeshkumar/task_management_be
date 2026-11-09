const { StatusCodes } = require("http-status-codes");
const ErrorMessageConstant = require("../constants/error.constant");
const responseUtils = require("../utils/response.utils");

class AppError extends Error {
  constructor(statusCode, message, retryable = undefined) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.description = message;
    this._retryable = retryable;
    Error.captureStackTrace(this, this.constructor);
  }
}

class InvalidRequestException extends AppError {
  constructor(message = ErrorMessageConstant.INVALID_REQUEST) {
    super(StatusCodes.BAD_REQUEST, message);
  }
}

class UnauthorizedException extends AppError {
  constructor(message = ErrorMessageConstant.UNAUTHORIZED) {
    super(StatusCodes.UNAUTHORIZED, message);
  }
}

class AccessDeniedException extends AppError {
  constructor(message = ErrorMessageConstant.ACCESS_DENIED) {
    super(StatusCodes.FORBIDDEN, message);
  }
}

class NotFoundException extends AppError {
  constructor(message = ErrorMessageConstant.NOT_FOUND) {
    super(StatusCodes.NOT_FOUND, message);
  }
}

class AlreadyExistsException extends AppError {
  constructor(message = ErrorMessageConstant.ALREADY_EXISTS) {
    super(StatusCodes.CONFLICT, message);
  }
}

class InternalServerException extends AppError {
  constructor(message = ErrorMessageConstant.SOMETHING_WENT_WRONG) {
    super(StatusCodes.INTERNAL_SERVER_ERROR, message);
  }
}

class SessionExpiredException extends AppError {
  constructor(message = ErrorMessageConstant.SESSION_EXPIRED) {
    super(StatusCodes.UNAUTHORIZED, message);
    this.forceLogout = true;
  }
}

function errorHandler(error, _req, res, next) {
  // If response has already started
  if (res.headersSent) {
    return next(error);
  }

  // Handle custom application errors
  if (error instanceof AppError) {
    return responseUtils.errorResponse(res, error.description, error.statusCode);
  }

  // Handle other known HTTP client errors
  const statusCode = Number.isInteger(error?.statusCode)
    ? error.statusCode
    : Number.isInteger(error?.status)
      ? error.status
      : null;

  if (statusCode && statusCode >= 400 && statusCode < 500) {
    return responseUtils.errorResponse(
      res,
      error.message || ErrorMessageConstant.INVALID_REQUEST,
      statusCode,
    );
  }

  // Log unexpected errors
  console.error("Unhandled Error:", error);

  // Handle unexpected server errors
  return responseUtils.errorResponse(
    res,
    ErrorMessageConstant.SOMETHING_WENT_WRONG,
    StatusCodes.INTERNAL_SERVER_ERROR,
  );
}

module.exports = {
  AppError,
  InvalidRequestException,
  InternalServerException,
  NotFoundException,
  UnauthorizedException,
  SessionExpiredException,
  AccessDeniedException,
  AlreadyExistsException,
  errorHandler,
};
