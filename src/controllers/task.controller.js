const MessageConstant = require("../constants/message.constant");
const taskService = require("../services/task.service");
const responseUtils = require("../utils/response.utils");

const taskController = {
  // POST /add
  async addTask(req, res, next) {
    try {
      const payload = {
        ...req.body,
        createdBy: req.body?.createdBy || req.user?.id,
      };
      const result = await taskService.addTask(payload);
      return responseUtils.okResponse(res, result, MessageConstant.TASK_CREATED_SUCCESSFULLY);
    } catch (error) {
      next(error);
    }
  },

  // GET /:taskId
  async getTaskById(req, res, next) {
    try {
      const result = await taskService.getTaskById(req?.params?.taskId || req?.params?.id);
      return responseUtils.okResponse(res, result);
    } catch (error) {
      next(error);
    }
  },

  // PUT /:taskId
  async updateTask(req, res, next) {
    try {
      const taskId = req?.params?.taskId || req?.params?.id || req?.body?.id;
      const result = await taskService.updateTask(taskId, req.body);
      return responseUtils.updatedResponse(res, result, MessageConstant.TASK_UPDATED_SUCCESSFULLY);
    } catch (error) {
      next(error);
    }
  },

  // DELETE /:taskId
  async deleteTask(req, res, next) {
    try {
      const taskId = req?.params?.taskId || req?.params?.id || req?.body?.id;
      const result = await taskService.deleteTask(taskId);
      return responseUtils.deletedResponse(res, result, MessageConstant.TASK_DELETED_SUCCESSFULLY);
    } catch (error) {
      next(error);
    }
  },

  // POST /filter
  async filterTasks(req, res, next) {
    try {
      const result = await taskService.filterTasks(req.body);
      return responseUtils.listResponse(res, result);
    } catch (error) {
      next(error);
    }
  },

  // POST /filter/paginated
  async filterTasksWithPagination(req, res, next) {
    try {
      const result = await taskService.filterTasksWithPagination(req.body);
      return responseUtils.paginationResponse(res, result);
    } catch (error) {
      next(error);
    }
  },

  // Backward-compatible handlers
  async getTasks(req, res, next) {
    try {
      const result = await taskService.getTasks({ projectId: req.query.projectId });
      return responseUtils.okResponse(res, result);
    } catch (error) {
      next(error);
    }
  },

  async getTaskStats(req, res, next) {
    try {
      const result = await taskService.getTaskStats({ projectId: req.query.projectId });
      return responseUtils.okResponse(res, result);
    } catch (error) {
      next(error);
    }
  },

  async createTask(req, res, next) {
    try {
      const result = await taskService.createTask({
        ...req.body,
        user: req.user,
      });
      return responseUtils.okResponse(res, result, MessageConstant.TASK_CREATED);
    } catch (error) {
      next(error);
    }
  },

  async updateTaskStatus(req, res, next) {
    try {
      const result = await taskService.updateTaskStatus({
        id: req.params.id || req.params.taskId,
        status: req.body.status,
        user: req.user,
      });
      return responseUtils.okResponse(res, result, MessageConstant.TASK_STATUS_UPDATED);
    } catch (error) {
      next(error);
    }
  },
};

module.exports = taskController;
