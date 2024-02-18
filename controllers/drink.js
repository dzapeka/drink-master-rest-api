const Drink = require('../models/drink');
const Category = require('../models/category');
const User = require('../models/user');
const getUserAge = require('../helpers/getUserAge');

const getRandomDrinks = async (req, res, next) => {
  let { drinksPerCategory } = req.query;

  drinksPerCategory = parseInt(drinksPerCategory);
  drinksPerCategory =
    isNaN(drinksPerCategory) || drinksPerCategory < 1 ? 3 : drinksPerCategory;

  try {
    const categories = await Category.find();

    if (!categories || categories.length === 0) {
      return res.status(404).json({ message: 'No categories found' });
    }

    const user = await User.findById(req.user.id);
    const userAge = getUserAge(user.dateOfBirth);

    let matchCondition = {};
    if (userAge < 18) {
      matchCondition = { alcoholic: 'Non alcoholic' };
    }

    const categoriesWithDrinks = await Promise.all(
      categories.map(async category => {
        const drinks = await Drink.aggregate([
          { $match: { category: category.category, ...matchCondition } },
          { $sample: { size: drinksPerCategory } },
        ]);
        return { category: category.category, drinks };
      })
    );

    return res.status(200).json(categoriesWithDrinks);
  } catch (error) {
    next(error);
  }
};

module.exports = { getRandomDrinks };
