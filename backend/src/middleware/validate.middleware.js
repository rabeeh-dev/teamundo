const ApiError = require('../utils/ApiError');

/**
 * Validate request body against a schema object
 * Schema is a plain object with field names and validator functions
 */
const validate = (schema) => (req, res, next) => {
  const errors = [];

  for (const [field, validator] of Object.entries(schema)) {
    const value = req.body[field];
    const error = validator(value);
    if (error) {
      errors.push(`${field}: ${error}`);
    }
  }

  if (errors.length > 0) {
    throw new ApiError(400, errors.join('; '));
  }

  next();
};

module.exports = { validate };
