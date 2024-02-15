const Joi = require('joi');

const userRegistrationSchema = Joi.object({
  email: Joi.string().email().trim().required(),
  password: Joi.string().min(3).required(),
});

module.exports = userRegistrationSchema;
