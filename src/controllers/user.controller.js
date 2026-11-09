const MessageConstant = require("../constants/message.constant");
const userService = require("../services/user.service");
const responseUtils = require("../utils/response.utils");

const userController = {
  async addUser(req, res, next) {
    try {
      const result = await userService.addUser(req.body);
      return responseUtils.okResponse(res, result, MessageConstant.USER_CREATED_SUCCESSFULLY);
    } catch (error) {
      next(error);
    }
  },

  async getUserById(req, res, next) {
    try {
      const result = await userService.getUserById(req?.params?.userId);
      return responseUtils.okResponse(res, result);
    } catch (error) {
      next(error);
    }
  },

  async updateUser(req, res, next) {
    try {
      const result = await userService.updateUser(req?.params?.userId || req?.body?.id, req.body);
      return responseUtils.updatedResponse(res, result, MessageConstant.USER_UPDATED_SUCCESSFULLY);
    } catch (error) {
      next(error);
    }
  },

  async deleteUser(req, res, next) {
    try {
      const result = await userService.deleteUser(req?.params?.userId || req?.body?.id);
      return responseUtils.deletedResponse(res, result, MessageConstant.USER_DELETED_SUCCESSFULLY);
    } catch (error) {
      next(error);
    }
  },

  async filterUsers(req, res, next) {
    try {
      const result = await userService.filterUser(req.body);
      return responseUtils.listResponse(res, result);
    } catch (error) {
      next(error);
    }
  },

  async filterUsersWithPagination(req, res, next) {
    try {
      const result = await userService.filterUsersWithPagination(req.body);
      return responseUtils.paginationResponse(res, result);
    } catch (error) {
      next(error);
    }
  },
};

module.exports = userController;
