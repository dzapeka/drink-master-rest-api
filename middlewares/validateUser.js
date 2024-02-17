const {
  userRegistrationSchema,
  userLoginSchema,
} = require('../validations/userValidation');

function validateSchema(schema) {
  return function (req, res, next) {
    const { error } = schema.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      return res.status(400).json({
        message: error.details
          .map(err => err.message.replaceAll('"', ''))
          .join(', '),
      });
    }
    next();
  };
}

const validateUserRegistration = validateSchema(userRegistrationSchema);
const validateUserLogin = validateSchema(userLoginSchema);

module.exports = { validateUserRegistration, validateUserLogin };
