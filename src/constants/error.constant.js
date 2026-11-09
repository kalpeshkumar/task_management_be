const ErrorMessageConstant = Object.freeze({
  // EXCEPTION CONFIG MESSAGE
  INVALID_REQUEST: "Invalid request",
  SESSION_EXPIRED: "Session expired. Please login again.",
  SOMETHING_WENT_WRONG: "Something went wrong",
  ALREADY_EXISTS: "Already exists",
  NOT_FOUND: "Not found",
  ACCESS_DENIED: "Access denied",
  UNAUTHORIZED: "Unauthorized",

  // USER / AUTH SIDE ERROR MESSAGE
  NAME_TOO_SHORT: "Name must be at least 2 characters long.",
  NAME_TOO_LONG: "Name must not exceed 50 characters.",
  ONLY_ALPHABETS: "Name must contain only alphabets.",
  EMAIL_REQUIRED: "Email address is required.",
  EMAIL_TOO_SHORT: "Email address is too short.",
  EMAIL_TOO_LONG: "Email address must not exceed 100 characters.",
  VALID_EMAIL_REQUIRED: "Please enter a valid email address.",
  PASSWORD_REQUIRED: "Password is required.",
  PASSWORD_TOO_SHORT: "Password must be at least 8 characters long.",
  PASSWORD_TOO_LONG: "Password must not exceed 20 characters.",
  PASSWORD_UPPERCASE_REQUIRED: "Password must contain at least one uppercase letter.",
  PASSWORD_LOWERCASE_REQUIRED: "Password must contain at least one lowercase letter.",
  PASSWORD_NUMBER_REQUIRED: "Password must contain at least one number.",
  PASSWORD_SYMBOL_REQUIRED: "Password must contain at least one special character (e.g., @, #, $).",
  ROLE_INVALID: "Please select a valid role.",
  USER_NOT_FOUND: "User not found.",
  USER_ALREADY_EXISTS: "User with this email already exists.",

  EMAIL_PASSWORD_REQUIRED: "Email and password are required.",
  INVALID_CREDENTIALS: "Invalid email or password.",
  ACCESS_DENIED_NO_TOKEN: "Access denied. No token provided.",
  INVALID_OR_EXPIRED_TOKEN: "Invalid or expired token.",
  INVALID_TOKEN: "Invalid or expired token.",
  INVALID_REFRESH_TOKEN: "Invalid or expired refresh token.",
  REFRESH_TOKEN_REQUIRED: "Refresh token is required.",
  CURRENT_PASSWORD_REQUIRED: "Current password is required.",
  NEW_PASSWORD_REQUIRED: "New password is required.",
  INVALID_CURRENT_PASSWORD: "Current password does not match.",
  NEW_PASSWORD_SAME_AS_OLD: "New password cannot be the same as current password.",
  RESET_TOKEN_REQUIRED: "Reset token is required.",
  INVALID_RESET_TOKEN: "Invalid or expired password reset token.",
  PASSWORD_NOT_SET: "PASSWORD_NOT_SET: Password is not set. Please use your setup link to set your password.",
  ACCOUNT_INACTIVE: "Account is inactive. Please contact your administrator.",
  INVALID_OR_EXPIRED_SETUP_TOKEN: "Invalid or expired password setup token.",
  PASSWORDS_DO_NOT_MATCH: "New password and confirmation password do not match.",
  PASSWORD_ALREADY_SET: "Password has already been set for this account.",
  CONFIRM_PASSWORD_REQUIRED: "Confirm password is required.",
  SETUP_TOKEN_REQUIRED: "Setup token is required.",
  FORBIDDEN_ROLE: (roles = []) =>
    `Forbidden. This action requires one of the following roles: ${roles.join(", ")}.`,

  // PROJECT SIDE ERROR MESSAGE
  PROJECT_NAME_REQUIRED: "Project name is required.",
  PROJECT_NAME_TOO_SHORT: "Project name must be at least 2 characters long.",
  PROJECT_NAME_TOO_LONG: "Project name must not exceed 255 characters.",
  PROJECT_NOT_FOUND: "Project not found.",
  PROJECT_REQUIRED: "Project is required.",

  // TASK SIDE ERROR MESSAGE
  TASK_TITLE_REQUIRED: "Task title is required.",
  TASK_TITLE_TOO_SHORT: "Task title must be at least 2 characters long.",
  TASK_TITLE_TOO_LONG: "Task title must not exceed 255 characters.",
  INVALID_STATUS: "Invalid status. Must be one of: Todo, In Progress, Completed.",
  TASK_NOT_FOUND: "Task not found.",
  TASK_STATUS_FORBIDDEN:
    "Forbidden. As an employee, you can only change the status of tasks assigned to you.",

  INTERNAL_SERVER_ERROR: "Internal server error",
  ROUTE_NOT_FOUND: (method = "", url = "") => `Route not found: ${method} ${url}`,
  JWT_SECRET_IS_REQUIRED: "JWT secret is required.",
});

module.exports = ErrorMessageConstant;
