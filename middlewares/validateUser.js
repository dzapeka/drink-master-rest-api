const {
  userRegistrationSchema,
  userLoginSchema,
} = require('../validations/userValidation');

function validateUserRegistration(req, res, next) {
  const { error } = userRegistrationSchema.validate(req.body, {
    abortEarly: false,
  });
  if (error) {
    return res
      .status(400)
      .send(error.details.map(err => err.message).join(', '));
  }
  next();
}

function validateUserLogin(req, res, next) {
  const { error } = userLoginSchema.validate(req.body, {
    abortEarly: false,
  });
  if (error) {
    return res
      .status(400)
      .send(error.details.map(err => err.message).join(', '));
  }
  next();
}

module.exports = { validateUserRegistration, validateUserLogin };
