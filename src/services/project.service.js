const { NotFoundException } = require("../configs/error.config");
const ErrorMessageConstant = require("../constants/error.constant");
const projectRepository = require("../repositories/project.repository");
const commonUtils = require("../utils/common.utils");
const { validSchema } = require("../validation/index.validation");
const { createProjectSchema, updateProjectSchema } = require("../validation/project.validation");
const MessageConstant = require("../constants/message.constant");
const userRepository = require("../repositories/user.repository");

class ProjectService {
  // Add a new project (User module style)
  async addProject(data, userId) {
    const user = await userRepository.getUserById(userId);
    if (commonUtils.isNullOrUndefined(user)) {
      throw new NotFoundException(ErrorMessageConstant.USER_NOT_FOUND)
    }
    const validatedData = await validSchema(createProjectSchema, data);
    return await projectRepository.create({ ...validatedData, createdBy: user.id });
  }

  // Get project by ID
  async getProjectById(id) {
    const project = await projectRepository.findById(id);
    if (commonUtils.isNullOrUndefined(project)) {
      throw new NotFoundException(ErrorMessageConstant.PROJECT_NOT_FOUND);
    }
    return project;
  }

  // Update project by ID
  async updateProject(id, data) {
    const validatedData = await validSchema(updateProjectSchema, data);
    const project = await projectRepository.updateProject(id, validatedData);
    if (commonUtils.isNullOrUndefined(project)) {
      throw new NotFoundException(ErrorMessageConstant.PROJECT_NOT_FOUND);
    }
    return project;
  }

  // Delete project by ID
  async deleteProject(id) {
    const project = await projectRepository.deleteProject(id);
    if (commonUtils.isNullOrUndefined(project)) {
      throw new NotFoundException(ErrorMessageConstant.PROJECT_NOT_FOUND);
    }
    return project;
  }

  // Filter projects (unpaginated)
  async filterProjects(data) {
    const { filter, sort } = data || {};
    return await projectRepository.filterProject(filter, sort);
  }

  // Filter projects with pagination
  async filterProjectsWithPagination(data) {
    const { filter, page, sort } = data || {};
    return await projectRepository.filterProjectWithPagination(filter, page, sort);
  }

  // Backward-compatible helpers for existing frontend/routes
  async getProjects() {
    const projects = await projectRepository.findAll();
    return { projects };
  }

  async createProject({ name, description, user }) {
    const newProject = await this.addProject({
      name,
      description,
      createdBy: user?.id,
    });

    return {
      message: MessageConstant.PROJECT_CREATED,
      project: {
        ...newProject,
        creator_name: user?.name,
        creatorName: user?.name,
        task_count: 0,
        taskCount: 0,
      },
    };
  }
}

module.exports = new ProjectService();
