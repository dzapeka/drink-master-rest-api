const Category = require('../models/category');
const Ingredient = require('../models/ingredient');
const Glass = require('../models/glass');
const getUserAge = require('../utils/getUserAge');
const User = require('../models/user');

const getCategories = async (req, res, next) => {
  try {
    const data = await Category.find()
      .collation({ locale: 'en', strength: 2 })
      .sort({ category: 1 });

    if (data === null) {
      res.status(404).json({ message: 'Categories not found' });
    }
    res.status(200).send(data);
  } catch (error) {
    next(error);
  }
};

const getIngredients = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    const userAge = getUserAge(user.dateOfBirth);
    let matchCondition = {};
    if (userAge < 18) {
      matchCondition = { alcohol: 'No' };
    }

    const data = await Ingredient.aggregate([{ $match: matchCondition }])
      .collation({ locale: 'en', strength: 2 })
      .sort({ title: 1 });

    if (data === null) {
      res.status(404).json({ message: 'Ingredients not found' });
    }
    res.status(200).send(data);
  } catch (error) {
    next(error);
  }
};

const getGlasses = async (req, res, next) => {
  try {
    const data = await Glass.find()
      .collation({ locale: 'en', strength: 2 })
      .sort({ glass: 1 });

    if (data === null) {
      res.status(404).json({ message: 'Glasses not found' });
    }
    res.status(200).send(data);
  } catch (error) {
    next(error);
  }
};

module.exports = { getCategories, getIngredients, getGlasses };
