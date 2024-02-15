const userRegistrationSchema = require('../validations/userValidation');

function validateUser(req, res, next) {
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

module.exports = validateUser;
