const { INTERNAL_SERVER_ERROR } = require("./error.constant");

const MessageConstant = Object.freeze({
  SUCCESS: "Success",
  ERROR: "Error",
  FAILED: "Failed",

  // RESPONSE UTILS MESSAGE
  CREATED_SUCCESSFULLY: "Created successfully",
  DELETED_SUCCESSFULLY: "Deleted successfully",
  UPDATED_SUCCESSFULLY: "Updated successfully",

  // AUTH MESSAGES
  REGISTER_SUCCESS: "User registered successfully",
  LOGIN_SUCCESS: "Login successful",
  LOGOUT_SUCCESS: "Logged out successfully",
  TOKEN_REFRESH_SUCCESS: "Token refreshed successfully",
  PASSWORD_CHANGED_SUCCESS: "Password changed successfully",
  PASSWORD_RESET_SUCCESS: "Password reset successfully",
  PASSWORD_RESET_EMAIL_SENT: "If your email is registered, you will receive password reset instructions.",
  PASSWORD_SET_SUCCESS: "Password set successfully. You can now log in.",
  SETUP_TOKEN_RESENT: "Setup token regenerated successfully.",

  PROJECT_CREATED: "Project created successfully",
  TASK_CREATED: "Task created successfully",
  TASK_STATUS_UPDATED: "Task status updated successfully",
  TASK_DELETED: "Task deleted successfully",

  // USER MESSAGES
  USER_DELETED_SUCCESSFULLY: "User deleted successfully",
  USER_CREATED_SUCCESSFULLY: "User created successfully",
  USER_UPDATED_SUCCESSFULLY: "User updated successfully",

  // PROJECT MESSAGES
  PROJECT_CREATED_SUCCESSFULLY: "Project created successfully",
  PROJECT_UPDATED_SUCCESSFULLY: "Project updated successfully",
  PROJECT_DELETED_SUCCESSFULLY: "Project deleted successfully",

  // TASK MESSAGES
  TASK_CREATED_SUCCESSFULLY: "Task created successfully",
  TASK_UPDATED_SUCCESSFULLY: "Task updated successfully",
  TASK_DELETED_SUCCESSFULLY: "Task deleted successfully",
});

module.exports = MessageConstant;
