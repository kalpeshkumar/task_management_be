const swaggerUi = require("swagger-ui-express");
const swaggerJsDocs = require("swagger-jsdoc");
const yaml = require("js-yaml");
const fs = require("fs");
const path = require("path");

const swaggerDefinitionPath = path.join(__dirname, "../api-docs/index.swagger.yaml");
const definition = yaml.load(fs.readFileSync(swaggerDefinitionPath, "utf8"));

// Use normalized forward-slash paths for swagger-jsdoc cross-platform compatibility
const apiDocsDir = path.resolve(__dirname, "../api-docs");
const apiFiles = [
  path.join(apiDocsDir, "auth.swagger.yaml"),
  path.join(apiDocsDir, "user.swagger.yaml"),
  path.join(apiDocsDir, "project.swagger.yaml"),
  path.join(apiDocsDir, "task.swagger.yaml"),
].map((p) => p.split(path.sep).join("/"));

const options = {
  definition,
  apis: apiFiles,
};

const swaggerSpec = swaggerJsDocs(options);
const SWAGGER_URL = "/swagger-ui"
function swaggerDocs(app, HOST_NAME) {
  // Swagger JSON spec endpoint
  app.get(`${SWAGGER_URL}/swagger.json`, (_req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
  });


  // Serve Swagger UI at /swagger-ui
  app.use(SWAGGER_URL, swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  console.log(`Swagger URL: ${HOST_NAME}${SWAGGER_URL}`);
}

module.exports = swaggerDocs;
