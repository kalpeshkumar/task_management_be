const MessageConstant = require("../constants/message.constant");
const projectService = require("../services/project.service");
const responseUtils = require("../utils/response.utils");

const projectController = {
  // POST /add
  async addProject(req, res, next) {
    try {
      const result = await projectService.addProject(req.body, req.user.id);
      return responseUtils.okResponse(res, result, MessageConstant.PROJECT_CREATED_SUCCESSFULLY);
    } catch (error) {
      next(error);
    }
  },

  // GET /:projectId
  async getProjectById(req, res, next) {
    try {
      const result = await projectService.getProjectById(req?.params?.projectId || req?.params?.id);
      return responseUtils.okResponse(res, result);
    } catch (error) {
      next(error);
    }
  },

  // PUT /:projectId
  async updateProject(req, res, next) {
    try {
      const projectId = req?.params?.projectId || req?.params?.id || req?.body?.id;
      const result = await projectService.updateProject(projectId, req.body);
      return responseUtils.updatedResponse(res, result, MessageConstant.PROJECT_UPDATED_SUCCESSFULLY);
    } catch (error) {
      next(error);
    }
  },

  // DELETE /:projectId
  async deleteProject(req, res, next) {
    try {
      const projectId = req?.params?.projectId || req?.params?.id || req?.body?.id;
      const result = await projectService.deleteProject(projectId);
      return responseUtils.deletedResponse(res, result, MessageConstant.PROJECT_DELETED_SUCCESSFULLY);
    } catch (error) {
      next(error);
    }
  },

  // POST /filter
  async filterProjects(req, res, next) {
    try {
      const result = await projectService.filterProjects(req.body);
      return responseUtils.listResponse(res, result);
    } catch (error) {
      next(error);
    }
  },

  // POST /filter/paginated
  async filterProjectsWithPagination(req, res, next) {
    try {
      const result = await projectService.filterProjectsWithPagination(req.body);
      return responseUtils.paginationResponse(res, result);
    } catch (error) {
      next(error);
    }
  },

  // Backward-compatible handlers
  async getProjects(req, res, next) {
    try {
      const result = await projectService.getProjects();
      return responseUtils.okResponse(res, result);
    } catch (error) {
      next(error);
    }
  },

  async createProject(req, res, next) {
    try {
      const result = await projectService.createProject({
        ...req.body,
        user: req.user,
      });
      return responseUtils.okResponse(res, result, MessageConstant.PROJECT_CREATED);
    } catch (error) {
      next(error);
    }
  },
};

module.exports = projectController;
