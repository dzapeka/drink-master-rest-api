const Joi = require('joi');

const ownDrinkSchema = Joi.object({
  drink: Joi.string().required(),
  shortDescription: Joi.string().required(),
  category: Joi.string().required(),
  glass: Joi.string().required(),
  alcoholic: Joi.string().required(),
  drinkThumb: Joi.string().required(),
  ingredients: Joi.array().items(
    Joi.object({
      title: Joi.string().required(),
      measure: Joi.string().required(),
      ingredientId: Joi.object({
        _id: Joi.string().required(),
      }).required(),
    })
  ),
  instructions: Joi.string().required(),
});

module.exports = ownDrinkSchema;
