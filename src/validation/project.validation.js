const { z } = require("zod");
const ErrorMessageConstant = require("../constants/error.constant");

const nameField = z
  .string({ required_error: ErrorMessageConstant.PROJECT_NAME_REQUIRED })
  .trim()
  .min(2, ErrorMessageConstant.PROJECT_NAME_TOO_SHORT)
  .max(255, ErrorMessageConstant.PROJECT_NAME_TOO_LONG);

const createProjectSchema = z
  .object({
    name: nameField,
    description: z.string().trim().optional().nullable(),
    createdBy: z.coerce.number().int().positive().optional().nullable(),
  })
  .strict();

const updateProjectSchema = z
  .object({
    name: z.string().trim().min(2, ErrorMessageConstant.PROJECT_NAME_TOO_SHORT).max(255, ErrorMessageConstant.PROJECT_NAME_TOO_LONG).optional(),
    description: z.string().trim().optional().nullable(),
  })
  .strict();

module.exports = {
  createProjectSchema,
  updateProjectSchema,
};

