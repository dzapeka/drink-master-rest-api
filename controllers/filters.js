const Category = require('../models/category');
const Ingredient = require('../models/ingredient');
const Glass = require('../models/glass');

const getCategories = async (req, res, next) => {
  try {
    const data = await Category.find()
      .collation({ locale: 'en', strength: 2 })
      .sort({ category: 1 });

    if (data == null) {
      res.status(404).json({ message: 'Categories not found' });
    }
    res.status(200).send(data);
  } catch (error) {
    console.log(error);
  }
};

const getIngredients = async (req, res, next) => {
  try {
    const data = await Ingredient.find();

    if (data == null) {
      res.status(404).json({ message: 'Ingredients not found' });
    }
    res.status(200).send(data);
  } catch (error) {
    console.log(error);
  }
};

const getGlasses = async (req, res, next) => {
  try {
    const data = await Glass.find();

    if (data == null) {
      res.status(404).json({ message: 'Glasses not found' });
    }
    res.status(200).send(data);
  } catch (error) {
    console.log(error);
  }
};

module.exports = { getCategories, getIngredients, getGlasses };
