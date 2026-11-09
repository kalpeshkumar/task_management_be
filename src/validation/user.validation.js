const { z } = require("zod");
const ErrorMessageConstant = require("../constants/error.constant");
const { RoleList } = require("../enums/role.enum");
const { hashPassword } = require("../utils/common.utils");

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

const roleField = z
  .enum(RoleList, {
    invalid_type_error: ErrorMessageConstant.ROLE_INVALID,
  })
  .optional()
  .default("USER");

const createUserSchema = z
  .object({
    name: nameField,
    email: emailField,
    role: roleField,
  })
  .strict();

module.exports = {
  createUserSchema,
};
