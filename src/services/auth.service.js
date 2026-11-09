const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const userRepository = require("../repositories/user.repository");
const MessageConstant = require("../constants/message.constant");
const ErrorMessageConstant = require("../constants/error.constant");
const {
  InvalidRequestException,
  NotFoundException,
  UnauthorizedException,
  AccessDeniedException,
} = require("../configs/error.config");
const JwtUtils = require("../utils/jwt.utils");
const { validSchema } = require("../validation/index.validation");
const {
  loginSchema,
  setPasswordSchema,
  changePasswordSchema,
  refreshTokenSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} = require("../validation/auth.validation");
const commonUtils = require("../utils/common.utils");

const authService = {
  // Authenticate user with email and password
  async login(data) {
    const { email, password } = await validSchema(loginSchema, data);

    const user = await userRepository.findByEmail(email);
    if (!user) {
      // Don't leak whether email exists
      throw new UnauthorizedException(ErrorMessageConstant.INVALID_CREDENTIALS);
    }

    // Inactive user check -> 403
    if (user.isActive === false) {
      throw new AccessDeniedException(ErrorMessageConstant.ACCOUNT_INACTIVE);
    }

    // User exists but password not set -> 403 with code "PASSWORD_NOT_SET"
    if (!user.isPasswordSet || !user.password) {
      return { isPasswordSet: false }
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException(ErrorMessageConstant.INVALID_CREDENTIALS);
    }

    const payload = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    const accessToken = JwtUtils.generateAccessToken(payload);
    const refreshToken = JwtUtils.generateRefreshToken(payload);

    const sanitizedUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      isPasswordSet: user.isPasswordSet,
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    return {
      message: MessageConstant.LOGIN_SUCCESS,
      token: accessToken,
      accessToken,
      refreshToken,
      user: sanitizedUser,
    };
  },

  // First-login password setup (public endpoint using setup token)
  async setPassword(data) {
    const validatedData = await validSchema(setPasswordSchema, data);
    const { email, newPassword } = validatedData;

    const user = await userRepository.findByEmail(email);

    if (!user) {
      throw new InvalidRequestException(ErrorMessageConstant.USER_NOT_FOUND);
    }

    if (user.isPasswordSet) {
      throw new InvalidRequestException(ErrorMessageConstant.PASSWORD_ALREADY_SET);
    }

    if (user.passwordSetupExpires && new Date(user.passwordSetupExpires) < new Date()) {
      throw new InvalidRequestException(ErrorMessageConstant.INVALID_OR_EXPIRED_SETUP_TOKEN);
    }

    const hashedPassword = commonUtils.hashPassword(newPassword);
    const updatedUser = await userRepository.setPassword(user.id, hashedPassword);

    const payload = {
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
    };

    const accessToken = JwtUtils.generateAccessToken(payload);
    const refreshToken = JwtUtils.generateRefreshToken(payload);

    return {
      message: MessageConstant.PASSWORD_SET_SUCCESS,
      token: accessToken,
      accessToken,
      refreshToken,
      user: updatedUser,
    };
  },

  // Change password for currently logged-in user
  async changePassword({ userId, currentPassword, newPassword, confirmPassword }) {
    await validSchema(changePasswordSchema, {
      currentPassword,
      newPassword,
      confirmPassword,
    });

    const user = await userRepository.findByIdWithPassword(userId);
    if (!user) {
      throw new NotFoundException(ErrorMessageConstant.USER_NOT_FOUND);
    }

    if (!user.password) {
      throw new AccessDeniedException(ErrorMessageConstant.PASSWORD_NOT_SET);
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      throw new InvalidRequestException(ErrorMessageConstant.INVALID_CURRENT_PASSWORD);
    }

    const isSamePassword = await bcrypt.compare(newPassword, user.password);
    if (isSamePassword) {
      throw new InvalidRequestException(ErrorMessageConstant.NEW_PASSWORD_SAME_AS_OLD);
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await userRepository.updatePassword(user.id, hashedPassword);

    return {
      message: MessageConstant.PASSWORD_CHANGED_SUCCESS,
    };
  },

  // Retrieve current logged in user details
  async getMe(userId) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException(ErrorMessageConstant.USER_NOT_FOUND);
    }
    return user;
  },

  // Invalidate refresh token on logout
  async logout(userId) {
    if (userId) {
      await userRepository.updateUser(userId, {
        logoutAt: new Date()
      });
    }
    return {
      message: MessageConstant.LOGOUT_SUCCESS,
    };
  },
};

module.exports = authService;
