const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const { verifyToken } = require("../middleware/auth.middleware");

// Public authentication endpoints
router.post("/login", authController.login);
router.post("/set-password", authController.setPassword);

// Protected authentication endpoints
router.get("/me", verifyToken, authController.getMe);
router.post("/logout", verifyToken, authController.logout);
router.post("/change-password", verifyToken, authController.changePassword);

module.exports = router;
