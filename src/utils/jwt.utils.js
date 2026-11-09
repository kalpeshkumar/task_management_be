const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });
require("dotenv").config();
const jwt = require("jsonwebtoken");
const { UnauthorizedException } = require("../configs/error.config");
const ErrorMessageConstant = require("../constants/error.constant");

class JwtUtils {
  static get JWT_SECRET() {
    return process.env.JWT_SECRET || "task_management_access_secret_key_2026";
  }

  static get JWT_EXPIRES_IN() {
    return process.env.JWT_EXPIRES_IN || "24h";
  }

  static get JWT_REFRESH_SECRET() {
    return (
      process.env.JWT_REFRESH_SECRET ||
      process.env.JWT_SECRET ||
      "task_management_refresh_secret_key_2026"
    );
  }

  static get JWT_REFRESH_EXPIRES_IN() {
    return process.env.JWT_REFRESH_EXPIRES_IN || "7d";
  }

  static ACCESS_TOKEN_TYPE = "access";
  static REFRESH_TOKEN_TYPE = "refresh";
  static TOKEN_TYPE = "Bearer";

  static generateAccessToken(payload, options = {}) {
    const { tokenType, ...rest } = payload || {};
    return jwt.sign(
      {
        ...rest,
        tokenType: this.ACCESS_TOKEN_TYPE,
      },
      this.JWT_SECRET,
      {
        expiresIn: this.JWT_EXPIRES_IN,
        ...options,
      }
    );
  }

  static generateRefreshToken(payload, options = {}) {
    const { tokenType, ...rest } = payload || {};
    return jwt.sign(
      {
        ...rest,
        tokenType: this.REFRESH_TOKEN_TYPE,
      },
      this.JWT_REFRESH_SECRET,
      {
        expiresIn: this.JWT_REFRESH_EXPIRES_IN,
        ...options,
      }
    );
  }

  static verifyAccessToken(token) {
    try {
      const payload = jwt.verify(token, this.JWT_SECRET);
      if (payload.tokenType && payload.tokenType !== this.ACCESS_TOKEN_TYPE) {
        throw new UnauthorizedException(ErrorMessageConstant.INVALID_TOKEN);
      }
      return payload;
    } catch (err) {
      if (err instanceof UnauthorizedException) throw err;
      throw new UnauthorizedException(ErrorMessageConstant.INVALID_OR_EXPIRED_TOKEN);
    }
  }

  static verifyRefreshToken(token) {
    try {
      const payload = jwt.verify(token, this.JWT_REFRESH_SECRET);
      if (payload.tokenType && payload.tokenType !== this.REFRESH_TOKEN_TYPE) {
        throw new UnauthorizedException(ErrorMessageConstant.INVALID_REFRESH_TOKEN);
      }
      return payload;
    } catch (err) {
      if (err instanceof UnauthorizedException) throw err;
      throw new UnauthorizedException(ErrorMessageConstant.INVALID_REFRESH_TOKEN);
    }
  }

  static getBearerToken(authorizationHeader) {
    if (!authorizationHeader) {
      throw new UnauthorizedException(ErrorMessageConstant.ACCESS_DENIED_NO_TOKEN);
    }

    const parts = authorizationHeader.split(" ");
    if (parts.length !== 2 || parts[0] !== this.TOKEN_TYPE || !parts[1]) {
      throw new UnauthorizedException(ErrorMessageConstant.INVALID_TOKEN);
    }

    return parts[1];
  }
}

module.exports = JwtUtils;
