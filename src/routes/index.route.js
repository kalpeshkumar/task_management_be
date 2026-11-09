const express = require("express");
const authRoute = require("./auth.route");
const projectRoute = require("./project.route");
const taskRoute = require("./task.route");
const userRoute = require("./user.route");

const route = express.Router();

// Health Check
route.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Standard Routes
route.use("/project", projectRoute);
route.use("/auth", authRoute);
route.use("/task", taskRoute);
route.use("/user", userRoute);

module.exports = route;
