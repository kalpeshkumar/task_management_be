const { NotFoundException } = require("../configs/error.config");
const ErrorMessageConstant = require("../constants/error.constant");
const taskRepository = require("../repositories/task.repository");
const commonUtils = require("../utils/common.utils");
const { validSchema } = require("../validation/index.validation");
const { createTaskSchema, updateTaskSchema, validStatusList } = require("../validation/task.validation");
const { Role } = require("../enums/role.enum");
const TaskStatus = require("../enums/status.enum");
const MessageConstant = require("../constants/message.constant");

class TaskService {
  // Add a new task (User module style)
  async addTask(data) {
    const validatedData = await validSchema(createTaskSchema, data);
    return await taskRepository.create(validatedData);
  }

  // Get task by ID
  async getTaskById(id) {
    const task = await taskRepository.findById(id);
    if (commonUtils.isNullOrUndefined(task)) {
      throw new NotFoundException(ErrorMessageConstant.TASK_NOT_FOUND);
    }
    return task;
  }

  // Update task by ID
  async updateTask(id, data) {
    const validatedData = await validSchema(updateTaskSchema, data);
    const task = await taskRepository.updateTask(id, validatedData);
    if (commonUtils.isNullOrUndefined(task)) {
      throw new NotFoundException(ErrorMessageConstant.TASK_NOT_FOUND);
    }
    return task;
  }

  // Delete task by ID
  async deleteTask(id) {
    const task = await taskRepository.deleteTask(id);
    if (commonUtils.isNullOrUndefined(task)) {
      throw new NotFoundException(ErrorMessageConstant.TASK_NOT_FOUND);
    }
    return task;
  }

  // Filter tasks (unpaginated)
  async filterTasks(data) {
    const { filter, sort } = data || {};
    return await taskRepository.filterTask(filter, sort);
  }

  // Filter tasks with pagination
  async filterTasksWithPagination(data) {
    const { filter, page, sort } = data || {};
    return await taskRepository.filterTaskWithPagination(filter, page, sort);
  }

  // Backward-compatible helper methods for dashboard / Kanban
  async getTasks({ projectId } = {}) {
    const parsedProjectId = projectId ? parseInt(projectId, 10) : null;
    const tasks = await taskRepository.findAll({ projectId: parsedProjectId });
    return { tasks };
  }

  async getTaskStats({ projectId } = {}) {
    const parsedProjectId = projectId ? parseInt(projectId, 10) : null;
    const statusRows = await taskRepository.findStatuses({ projectId: parsedProjectId });

    const stats = {
      total: statusRows.length,
      todo: statusRows.filter((t) => t.status === TaskStatus.TODO).length,
      in_progress: statusRows.filter((t) => t.status === TaskStatus.IN_PROGRESS).length,
      completed: statusRows.filter((t) => t.status === TaskStatus.COMPLETED).length,
    };

    return { stats };
  }

  async createTask({
    title,
    description,
    projectId,
    project_id,
    assignedTo,
    assigned_to,
    dueDate,
    due_date,
    status = "Todo",
    user,
  }) {
    const taskData = {
      title,
      description,
      projectId: projectId || project_id,
      assignedTo: assignedTo || assigned_to,
      status: status || "Todo",
      dueDate: dueDate || due_date,
      createdBy: user?.id,
    };

    const newTask = await this.addTask(taskData);
    const fullTask = await taskRepository.findById(newTask.id);

    return {
      message: MessageConstant.TASK_CREATED,
      task: fullTask,
    };
  }

  async updateTaskStatus({ id, status, user }) {
    if (!status || !validStatusList.includes(status)) {
      const error = new Error(ErrorMessageConstant.INVALID_STATUS);
      error.status = 400;
      throw error;
    }

    const task = await taskRepository.findById(id);
    if (!task) {
      throw new NotFoundException(ErrorMessageConstant.TASK_NOT_FOUND);
    }

    const isEmployee = user?.role?.toLowerCase() === "employee" || user?.role?.toLowerCase() === "user";
    if (isEmployee && user?.role?.toLowerCase() !== "admin" && task.assignedTo !== user?.id) {
      const error = new Error(ErrorMessageConstant.TASK_STATUS_FORBIDDEN);
      error.status = 403;
      throw error;
    }

    const updated = await taskRepository.updateStatus(id, status);
    const fullTask = await taskRepository.findById(id);

    return {
      message: MessageConstant.TASK_STATUS_UPDATED,
      task: fullTask || updated,
    };
  }
}

module.exports = new TaskService();
