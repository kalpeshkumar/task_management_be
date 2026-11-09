const express = require("express");
const router = express.Router();
const projectController = require("../controllers/project.controller");
const { verifyToken, requireRole } = require("../middleware/auth.middleware");
const { Role } = require("../enums/role.enum");

// 6 Standard Endpoints (matching user.route.js pattern)
router.post("/add", verifyToken, requireRole(Role.ADMIN), projectController.addProject);
router.put("/:projectId", verifyToken, requireRole(Role.ADMIN), projectController.updateProject);
router.get("/:projectId", verifyToken, requireRole(Role.ADMIN), projectController.getProjectById);
router.delete("/:projectId", verifyToken, requireRole(Role.ADMIN), projectController.deleteProject);
router.post("/filter", verifyToken, requireRole(Role.ADMIN), projectController.filterProjects);
router.post(
  "/filter/paginated",
  verifyToken,
  requireRole(Role.ADMIN),
  projectController.filterProjectsWithPagination,
);

// Backward-compatible endpoints for existing frontend
router.get("/", verifyToken, projectController.getProjects);

module.exports = router;
