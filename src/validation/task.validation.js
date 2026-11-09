const { z } = require("zod");
const ErrorMessageConstant = require("../constants/error.constant");
const TaskStatus = require("../enums/status.enum");

const validStatusList = [TaskStatus.TODO, TaskStatus.IN_PROGRESS, TaskStatus.COMPLETED, "Todo", "In Progress", "Completed"];

const titleField = z
  .string({ required_error: ErrorMessageConstant.TASK_TITLE_REQUIRED })
  .trim()
  .min(2, ErrorMessageConstant.TASK_TITLE_TOO_SHORT)
  .max(255, ErrorMessageConstant.TASK_TITLE_TOO_LONG);

const createTaskSchema = z
  .object({
    title: titleField,
    description: z.string().trim().optional().nullable(),
    projectId: z.coerce.number({ required_error: ErrorMessageConstant.PROJECT_REQUIRED }).int().positive(),
    assignedTo: z.coerce.number().int().positive().optional().nullable(),
    status: z.string().optional().default("Todo"),
    dueDate: z.string().optional().nullable(),
    createdBy: z.coerce.number().int().positive().optional().nullable(),
  })
  .strict();

const updateTaskSchema = z
  .object({
    title: z.string().trim().min(2, ErrorMessageConstant.TASK_TITLE_TOO_SHORT).max(255, ErrorMessageConstant.TASK_TITLE_TOO_LONG).optional(),
    description: z.string().trim().optional().nullable(),
    projectId: z.coerce.number().int().positive().optional(),
    assignedTo: z.coerce.number().int().positive().optional().nullable(),
    status: z.string().optional(),
    dueDate: z.string().optional().nullable(),
  })
  .strict();

module.exports = {
  createTaskSchema,
  updateTaskSchema,
  validStatusList,
};

