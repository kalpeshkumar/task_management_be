const { ZodError } = require("zod");
const { InvalidRequestException } = require("../configs/error.config");

class ValidationSchema {
  async validSchema(schema, payload) {
    try {
      return await schema.parseAsync(payload);
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessage = error?.issues?.[0]?.message || error.message;
        throw new InvalidRequestException(errorMessage);
      }
      throw error;
    }
  }
}

const validationInstance = new ValidationSchema();

module.exports = {
  ValidationSchema,
  validationInstance,
  validSchema: validationInstance.validSchema.bind(validationInstance),
};
