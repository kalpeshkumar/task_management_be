const MessageConstant = require("../constants/message.constant");
const authService = require("../services/auth.service");
const responseUtils = require("../utils/response.utils");

const authController = {

  // POST /auth/login
  async login(req, res, next) {
    try {
      const result = await authService.login(req.body);
      return responseUtils.okResponse(res, result, MessageConstant.LOGIN_SUCCESS);
    } catch (err) {
      next(err);
    }
  },

  // GET /auth/me
  async getMe(req, res, next) {
    try {
      const result = await authService.getMe(req.user.id);
      return responseUtils.okResponse(res, result);
    } catch (err) {
      next(err);
    }
  },

  // POST /auth/logout (and GET /auth/logout)
  async logout(req, res, next) {
    try {
      const result = await authService.logout(req.user?.id);
      return responseUtils.okResponse(res, result, MessageConstant.LOGOUT_SUCCESS);
    } catch (err) {
      next(err);
    }
  },

  // POST /auth/set-password
  async setPassword(req, res, next) {
    try {
      const result = await authService.setPassword(req.body);
      return responseUtils.okResponse(res, result, MessageConstant.PASSWORD_SET_SUCCESS);
    } catch (err) {
      next(err);
    }
  },

  // POST /auth/change-password
  async changePassword(req, res, next) {
    try {
      const result = await authService.changePassword({
        userId: req.user.id,
        currentPassword: req.body?.currentPassword,
        newPassword: req.body?.newPassword,
        confirmPassword: req.body?.confirmPassword,
      });
      return responseUtils.okResponse(res, result, MessageConstant.PASSWORD_CHANGED_SUCCESS);
    } catch (err) {
      next(err);
    }
  },
};

module.exports = authController;
