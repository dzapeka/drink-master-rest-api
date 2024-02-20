const Drink = require('../models/drink');
const Category = require('../models/category');
const User = require('../models/user');
const getUserAge = require('../utils/getUserAge');
const { getRandomElementsFromArray } = require('../utils/arrayUtils');

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

    let categoriesWithDrinks = await Promise.all(
      categories.map(async category => {
        const drinks = await Drink.aggregate([
          { $match: { category: category.category, ...matchCondition } },
          { $sample: { size: drinksPerCategory } },
        ]);

        if (drinks.length >= drinksPerCategory) {
          return { category: category.category, drinks };
        }
      })
    ).then(results => results.filter(item => item));

    categoriesWithDrinks = getRandomElementsFromArray(categoriesWithDrinks, 4);

    return res.status(200).json(categoriesWithDrinks);
  } catch (error) {
    next(error);
  }
};

const search = async (req, res, next) => {
  try {
    const { name, category, ingredient, page = 1, size = 10 } = req.query;
    const filter = {};
    if (name) filter.drink = { $regex: name, $options: 'i' };
    if (category) filter.category = category;
    if (ingredient) filter.ingredients = { $elemMatch: { title: ingredient } };

    const drinks = await Drink.find(filter)
      .skip((page - 1) * size)
      .limit(Number(size));

    if (drinks.length === 0) {
      return res.status(404).json({ message: 'No drinks found' });
    }
    const total = await Drink.countDocuments(filter);

    res.json({
      totalPages: Math.ceil(total / size),
      currentPage: page,
      drinks,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getRandomDrinks, search };
