const express = require("express");
const router = express.Router();
const taskController = require("../controllers/task.controller");
const { verifyToken, requireRole } = require("../middleware/auth.middleware");
const { Role } = require("../enums/role.enum");

// 6 Standard Endpoints (matching user.route.js pattern)
router.post("/add", verifyToken, requireRole(Role.ADMIN), taskController.addTask);
router.put("/:taskId", verifyToken, requireRole(Role.ADMIN), taskController.updateTask);
router.get("/:taskId", verifyToken, requireRole(Role.ADMIN), taskController.getTaskById);
router.delete("/:taskId", verifyToken, requireRole(Role.ADMIN), taskController.deleteTask);
router.post("/filter", verifyToken, requireRole(Role.ADMIN), taskController.filterTasks);
router.post(
  "/filter/paginated",
  verifyToken,
  requireRole(Role.ADMIN),
  taskController.filterTasksWithPagination,
);

// Backward-compatible endpoints for existing dashboard & Kanban board
router.get("/", verifyToken, taskController.getTasks);
router.get("/stats", verifyToken, taskController.getTaskStats);
router.post("/", verifyToken, taskController.createTask);
router.patch("/:id/status", verifyToken, taskController.updateTaskStatus);

module.exports = router;
