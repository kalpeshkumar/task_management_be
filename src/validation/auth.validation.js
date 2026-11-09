const { z } = require("zod");
const ErrorMessageConstant = require("../constants/error.constant");
const { RoleList } = require("../enums/role.enum");

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const UPPER_CASE_REGEX = /[A-Z]/;
const LOWER_CASE_REGEX = /[a-z]/;
const NUMBER_REGEX = /[0-9]/;
const SYMBOL_REGEX = /[@$!%*?&]/;
const ALPHABET_REGEX = /^[A-Za-z\s]+$/;

const nameField = z
  .string({ required_error: ErrorMessageConstant.NAME_TOO_SHORT })
  .trim()
  .min(2, ErrorMessageConstant.NAME_TOO_SHORT)
  .max(255, ErrorMessageConstant.NAME_TOO_LONG)
  .regex(ALPHABET_REGEX, ErrorMessageConstant.ONLY_ALPHABETS);

const emailField = z
  .string({ required_error: ErrorMessageConstant.EMAIL_REQUIRED })
  .trim()
  .min(5, ErrorMessageConstant.EMAIL_TOO_SHORT)
  .max(255, ErrorMessageConstant.EMAIL_TOO_LONG)
  .regex(EMAIL_REGEX, ErrorMessageConstant.VALID_EMAIL_REQUIRED)
  .toLowerCase();

const passwordField = z
  .string({ required_error: ErrorMessageConstant.PASSWORD_REQUIRED })
  .trim()
  .min(8, ErrorMessageConstant.PASSWORD_TOO_SHORT)
  .max(255, ErrorMessageConstant.PASSWORD_TOO_LONG)
  .refine((val) => UPPER_CASE_REGEX.test(val), ErrorMessageConstant.PASSWORD_UPPERCASE_REQUIRED)
  .refine((val) => LOWER_CASE_REGEX.test(val), ErrorMessageConstant.PASSWORD_LOWERCASE_REQUIRED)
  .refine((val) => NUMBER_REGEX.test(val), ErrorMessageConstant.PASSWORD_NUMBER_REQUIRED)
  .refine((val) => SYMBOL_REGEX.test(val), ErrorMessageConstant.PASSWORD_SYMBOL_REQUIRED);

const roleField = z
  .enum(RoleList, {
    invalid_type_error: ErrorMessageConstant.ROLE_INVALID,
  })
  .optional()
  .default("USER");

const registerSchema = z
  .object({
    name: nameField,
    email: emailField,
    password: passwordField,
    role: roleField,
  })
  .strict();

const loginSchema = z
  .object({
    email: emailField,
    password: z
      .string({ required_error: ErrorMessageConstant.PASSWORD_REQUIRED })
      .min(1, ErrorMessageConstant.PASSWORD_REQUIRED)
      .optional(),
  })
  .strict();

const refreshTokenSchema = z
  .object({
    refreshToken: z.string({ required_error: ErrorMessageConstant.REFRESH_TOKEN_REQUIRED }).min(1, ErrorMessageConstant.REFRESH_TOKEN_REQUIRED),
  })
  .strict();

const changePasswordSchema = z
  .object({
    currentPassword: z.string({ required_error: ErrorMessageConstant.CURRENT_PASSWORD_REQUIRED }).min(1, ErrorMessageConstant.CURRENT_PASSWORD_REQUIRED),
    newPassword: passwordField,
    confirmPassword: z.string({ required_error: ErrorMessageConstant.CONFIRM_PASSWORD_REQUIRED }).min(1, ErrorMessageConstant.CONFIRM_PASSWORD_REQUIRED),
  })
  .strict()
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: ErrorMessageConstant.PASSWORDS_DO_NOT_MATCH,
    path: ["confirmPassword"],
  })
  .refine((data) => data.newPassword !== data.currentPassword, {
    message: ErrorMessageConstant.NEW_PASSWORD_SAME_AS_OLD,
    path: ["newPassword"],
  });

const setPasswordSchema = z
  .object({
    email: z.string({ required_error: ErrorMessageConstant.EMAIL_REQUIRED }).min(1, ErrorMessageConstant.EMAIL_REQUIRED),
    newPassword: passwordField,
    confirmPassword: z.string({ required_error: ErrorMessageConstant.CONFIRM_PASSWORD_REQUIRED }).min(1, ErrorMessageConstant.CONFIRM_PASSWORD_REQUIRED),
  })
  .strict()
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: ErrorMessageConstant.PASSWORDS_DO_NOT_MATCH,
    path: ["confirmPassword"],
  });

const forgotPasswordSchema = z
  .object({
    email: emailField,
  })
  .strict();

const resetPasswordSchema = z
  .object({
    token: z.string({ required_error: ErrorMessageConstant.RESET_TOKEN_REQUIRED }).min(1, ErrorMessageConstant.RESET_TOKEN_REQUIRED),
    newPassword: passwordField,
  })
  .strict();

module.exports = {
  registerSchema,
  loginSchema,
  refreshTokenSchema,
  changePasswordSchema,
  setPasswordSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
};

