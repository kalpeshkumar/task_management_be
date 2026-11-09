const crypto = require("crypto");
const {
  NotFoundException,
  AlreadyExistsException,
  InvalidRequestException,
} = require("../configs/error.config");
const ErrorMessageConstant = require("../constants/error.constant");
const MessageConstant = require("../constants/message.constant");
const userRepository = require("../repositories/user.repository");
const commonUtils = require("../utils/common.utils");
const { validSchema } = require("../validation/index.validation");
const { createUserSchema } = require("../validation/user.validation");
const { Role } = require("../enums/role.enum");

class UserService {
  async addUser(data) {
    const validateData = await validSchema(createUserSchema, data);

    const existingUser = await userRepository.findByEmail(validateData.email);
    if (existingUser) {
      throw new AlreadyExistsException(ErrorMessageConstant.USER_ALREADY_EXISTS);
    }

    return await userRepository.create({
      name: validateData.name,
      email: validateData.email,
      role: validateData.role || Role.USER,
      password: null,
      isActive: true,
    });
  }

  async getUserById(id) {
    const user = await userRepository.getUserById(id);
    if (commonUtils.isNullOrUndefined(user)) {
      throw new NotFoundException(ErrorMessageConstant.USER_NOT_FOUND);
    }
    return user;
  }

  async updateUser(id, data) {
    const user = await userRepository.updateUser(id, data);
    if (commonUtils.isNullOrUndefined(user)) {
      throw new NotFoundException(ErrorMessageConstant.USER_NOT_FOUND);
    }
    return user;
  }

  async deleteUser(id) {
    const user = await userRepository.deleteUser(id);
    if (commonUtils.isNullOrUndefined(user)) {
      throw new NotFoundException(ErrorMessageConstant.USER_NOT_FOUND);
    }
    return user;
  }

  async filterUser(data) {
    const { filter, sort } = data || {};
    return await userRepository.filterUser(filter, sort);
  }

  async filterUsersWithPagination(data) {
    const { filter, page, sort } = data || {};
    return await userRepository.filterUserWithPagination(filter, page, sort);
  }
}

module.exports = new UserService();
