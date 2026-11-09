const express = require("express");
const cors = require("./configs/cors.config");
const routes = require("./routes/index.route");

const errorMessages = require("./constants/error.constant");
const { NotFoundException, errorHandler } = require("./configs/error.config");
const swaggerDocs = require("./configs/swagger.config");

const app = express();
const PORT = process.env.PORT || 5000;
const HOST_NAME = process.env.HOST_NAME || `http://localhost:${PORT}`;

// Global Middlewares
app.use(cors);
app.use(express.json());

// Swagger Documentation
swaggerDocs(app, HOST_NAME);

// Mount Routes at both /api and root
app.use(routes);

// 404 Not Found Handler
app.use((req, _res, next) => {
  next(new NotFoundException(errorMessages.ROUTE_NOT_FOUND(req.method, req.originalUrl)));
});

// Global Exception Handler (must be registered last)
app.use(errorHandler);

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Task Management Backend Server is running on ${HOST_NAME}`);
  });
}

module.exports = app;

