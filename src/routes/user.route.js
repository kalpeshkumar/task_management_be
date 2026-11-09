const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const { verifyToken, requireRole } = require("../middleware/auth.middleware");
const { Role } = require("../enums/role.enum");

router.post("/add", verifyToken, requireRole(Role.ADMIN), userController.addUser);
router.put("/:userId", verifyToken, requireRole(Role.ADMIN), userController.updateUser);
router.get("/:userId", verifyToken, requireRole(Role.ADMIN), userController.getUserById);
router.delete("/:userId", verifyToken, requireRole(Role.ADMIN), userController.deleteUser);
router.post("/filter", verifyToken, requireRole(Role.ADMIN), userController.filterUsers);
router.post(
  "/filter/paginated",
  verifyToken,
  requireRole(Role.ADMIN),
  userController.filterUsersWithPagination,
);

module.exports = router;
