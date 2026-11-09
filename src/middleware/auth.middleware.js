const JwtUtils = require("../utils/jwt.utils");
const errorMessages = require("../constants/error.constant");
const {
  SessionExpiredException,
  UnauthorizedException,
  AccessDeniedException,
} = require("../configs/error.config");

// Ensures the incoming request includes a valid Bearer token
const verifyToken = (req, res, next) => {
  const token = JwtUtils.getBearerToken(req.headers.authorization);
  try {
    const decoded = JwtUtils.verifyAccessToken(token);
    req.user = decoded;
    next();
  } catch (err) {
    throw new SessionExpiredException(errorMessages.INVALID_OR_EXPIRED_TOKEN);
  }
};

// Middleware: requireRole
// Enforces that only users with specific roles (e.g. Role.ADMIN) can proceed
const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      throw new UnauthorizedException(errorMessages.ACCESS_DENIED_NO_TOKEN);
    }

    const userRoleLower = req.user.role.toLowerCase();
    const hasRole = allowedRoles.some((r) => r.toLowerCase() === userRoleLower);

    if (!hasRole) {
      throw new AccessDeniedException(errorMessages.FORBIDDEN_ROLE(allowedRoles));
    }
    next();
  };
};

module.exports = {
  verifyToken,
  requireRole,
};
