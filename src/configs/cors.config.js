const cors = require("cors");
const { MethodTypeList } = require("../enums/method.enum");

const corsOptions = {
  origin: process.env.CORS_ORIGIN || "*",
  methods: MethodTypeList,
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

module.exports = cors(corsOptions);
