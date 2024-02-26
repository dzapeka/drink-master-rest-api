const mongoose = require('mongoose');
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
          {
            $project: {
              _id: 1,
              drink: 1,
              category: 1,
              alcoholic: 1,
              glass: 1,
              description: 1,
              instructions: 1,
              drinkThumb: 1,
              ingredients: 1,
              shortDescription: 1,
            },
          },
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
    const user = await User.findById(req.user.id);
    const userAge = getUserAge(user.dateOfBirth);

    const { name, category, ingredient, page = 1, size = 10 } = req.query;
    const filter = {};
    if (name) filter.drink = { $regex: name, $options: 'i' };
    if (category) filter.category = category;
    if (ingredient) filter.ingredients = { $elemMatch: { title: ingredient } };
    if (userAge < 18)
      filter.alcoholic = {
        $not: { $regex: /^Alcoholic$/i },
      };

    const drinks = await Drink.find(filter)
      .skip((page - 1) * size)
      .limit(Number(size));

    if (drinks.length === 0) {
      return res.status(404).json({ message: 'No drinks found' });
    }
    const total = await Drink.countDocuments(filter);

    res.json({
      total,
      totalPages: Math.ceil(total / size),
      currentPage: page,
      drinks,
    });
  } catch (error) {
    next(error);
  }
};

const getDrinkById = async (req, res, next) => {
  try {
    const drinkId = req.params.id;
    const userId = req.user.id;
    console.log('USER_ID: ', userId);

    if (!mongoose.Types.ObjectId.isValid(drinkId)) {
      return res
        .status(400)
        .json({ message: 'Incorrectly entered data. Cocktail id is expected' });
    }

    const drinkData = await Drink.findOne({ _id: drinkId })
      .populate('ingredients.ingredientId')
      .lean();

    if (drinkData === null) {
      return res.status(404).json({ message: 'Drink not found' });
    }

    drinkData.isFavoriteByUser = drinkData.favoritedBy
      .map(id => id.toString())
      .includes(userId);

    const modifiedIngredients = drinkData.ingredients.map(ingredient => ({
      _id: ingredient._id,
      title: ingredient.title,
      measure: ingredient.measure,
      ingredient: ingredient.ingredientId,
    }));

    const modifiedDrink = {
      ...drinkData,
      ingredients: modifiedIngredients,
    };

    return res.status(200).send(modifiedDrink);
  } catch (error) {
    next(error);
  }
};

const getPopularDrinks = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    const userAge = getUserAge(user.dateOfBirth);

    let matchCondition = {};
    if (userAge < 18) {
      matchCondition = { alcoholic: 'Non alcoholic' };
    }

    const popularDrinks = await Drink.aggregate([
      { $match: { ...matchCondition } },
      {
        $addFields: {
          favoritedByCount: { $size: '$favoritedBy' },
        },
      },
      {
        $sort: { favoritedByCount: -1 },
      },
      {
        $project: { favoritedBy: 0 },
      },
      {
        $limit: 4,
      },
    ]);

    if (popularDrinks === null || typeof popularDrinks === 'undefined') {
      return res.status(404).json({ message: 'Popular drinks not found' });
    }
    return res.status(200).send(popularDrinks);
  } catch (error) {
    next(error);
  }
};

const addOwnDrink = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const drinkThumb = req.file ? req.file.path : '';
    const {
      drink,
      category,
      glass,
      alcoholic,
      description,
      shortDescription,
      instructions,
      ingredients,
    } = req.body;

    // TODO: Remove this after the issue is fixed on the frontend side
    const descriptionValue = description || shortDescription;

    const parsedIngredients = JSON.parse(ingredients);

    const newDrink = await Drink.create({
      drink,
      category,
      glass,
      alcoholic,
      description: descriptionValue,
      shortDescription,
      instructions,
      drinkThumb,
      ingredients: parsedIngredients,
      ownerId: userId,
    });

    return res.status(201).json({
      message: 'Cocktail successfully created',
      newDrink,
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Cocktail creation failed',
      error: error.message,
    });
  }
};

const getOwnDrinks = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { page = 1, size = 10 } = req.query;

    const filter = {
      ownerId: userId,
    };

    const ownDrinks = await Drink.find(filter, {
      favoritedBy: 0,
      ownerId: 0,
    })
      .skip((page - 1) * size)
      .limit(Number(size));

    const total = await Drink.countDocuments(filter);
    return res.status(200).json({
      total,
      totalPages: Math.ceil(total / size),
      currentPage: page,
      ownDrinks,
    });
  } catch (error) {
    console.log(error);
  }
};

const removeFromOwnDrinks = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { drinkId } = req.params;

    if (
      drinkId === null ||
      typeof drinkId === 'undefined' ||
      !mongoose.Types.ObjectId.isValid(drinkId)
    ) {
      return res.status(400).json({ message: 'Not valid drinkId' });
    }

    const ownDrink = await Drink.findById(drinkId);

    if (ownDrink === null) {
      return res.status(404).json({ message: 'Own drink not found' });
    }

    const isInDrinks = ownDrink.ownerId.toString() === userId;

    if (!isInDrinks) {
      return res.status(403).json({
        message: 'The user does not have such a cocktail in his own drinks',
      });
    }

    await Drink.findByIdAndDelete(drinkId, { new: false });

    return res.status(200).json({
      message: 'The cocktail was successfully removed',
      drinkId,
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  getRandomDrinks,
  search,
  getDrinkById,
  getPopularDrinks,
  addOwnDrink,
  getOwnDrinks,
  removeFromOwnDrinks,
};
