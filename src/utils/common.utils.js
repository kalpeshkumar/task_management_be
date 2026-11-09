const bcrypt = require("bcrypt");

class CommonUtils {
  constructor() {
    /*10 = Faster hashing.
    12 = Strong security and a good general-purpose choice.
    14 = More secure but slower.
    16 = Significantly slower.*/
    this.SALT_ROUND = process.env.SALT_ROUND || 12;
  }

  isNullOrUndefined(value) {
    return value === null || value === undefined;
  }

  isValidArray(value) {
    return Array.isArray(value) && value.length > 0;
  }

  // Convert and validate positive integer
  toPositiveInteger(value, fallback) {
    const parsed = Number(value);

    if (!Number.isSafeInteger(parsed) || parsed < 1) {
      return fallback;
    }

    return parsed;
  }

  //Hash password
  async hashPassword(password) {
    return await bcrypt.hash(password, this.SALT_ROUND);
  }

  //Compare password
  async comparePassword(password, hashedPassword) {
    return await bcrypt.compare(password, hashedPassword);
  }
}

module.exports = new CommonUtils();
