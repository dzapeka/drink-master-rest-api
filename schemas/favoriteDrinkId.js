const Joi = require('joi');

const drinkIdSchema = Joi.object({
  drinkId: Joi.string().required(),
});

module.exports = drinkIdSchema;
