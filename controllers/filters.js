const Category = require('../models/categories');
const Ingredient = require('../models/ingredients');
const Glass = require('../models/glasses');

const getCategories = async (req, res, next) => {
  try {
    const data = await Category.find()
      .collation({ locale: 'en', strength: 2 })
      .sort({ category: 1 });

    if (data !== null) {
      res.status(200).send(data);
    } else next();
  } catch (error) {
    next(error);
  }
};

const getIngredients = async (req, res, next) => {
  try {
    const data = await Ingredient.find();

    if (data !== null) {
      res.status(200).send(data);
    } else next();
  } catch (error) {
    next(error);
  }
};

const getGlasses = async (req, res, next) => {
  try {
    const data = await Glass.find();

    if (data !== null) {
      res.status(200).send(data);
    } else next();
  } catch (error) {
    next(error);
  }
};

module.exports = { getCategories, getIngredients, getGlasses };
