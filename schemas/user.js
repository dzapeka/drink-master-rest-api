const Joi = require('joi');

const userRegistrationSchema = Joi.object({
  name: Joi.string().trim().required(),
  email: Joi.string().email().trim().required(),
  password: Joi.string().min(3).required(),
  dateOfBirth: Joi.date().max('now').iso().required(),
});

const userLoginSchema = Joi.object({
  email: Joi.string().email().trim().required(),
  password: Joi.string().min(3).required(),
});

const userSubscribeSchema = Joi.object({
  email: Joi.string().email().trim().required(),
});

const userUpdateSchema = Joi.object({
  name: Joi.string().trim().required(),
});

module.exports = {
  userRegistrationSchema,
  userLoginSchema,
  userSubscribeSchema,
  userUpdateSchema,
};
