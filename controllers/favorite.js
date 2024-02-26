const Drink = require('../models/drink');
const drinkIdSchema = require('../schemas/favoriteDrinkId');
const mongoose = require('mongoose');

const getFavoriteDrinks = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { page = 1, size = 10 } = req.query;
    const filter = {
      favoritedBy: userId,
    };

    const favoriteDrinks = await Drink.find(filter, { favoritedBy: 0 })
      .lean()
      .skip((page - 1) * size)
      .limit(Number(size));

    const total = await Drink.countDocuments(filter);

    return res.json({
      total,
      totalPages: Math.ceil(total / size),
      currentPage: page,
      favoriteDrinks,
    });
  } catch (error) {
    next(error);
  }
};

const addToFavoriteDrinks = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const drinkId = req.body.drinkId;

    if (
      drinkId === null ||
      typeof drinkId === 'undefined' ||
      !mongoose.Types.ObjectId.isValid(drinkId)
    ) {
      return res
        .status(400)
        .json({ message: 'Incorrectly entered data. Cocktail id is expected' });
    }

    const response = drinkIdSchema.validate({ drinkId }, { abortEarly: false });
    if (typeof response.error !== 'undefined') {
      return res.status(400).send({
        message: response.error.details.map(err => err.message).join(', '),
      });
    }

    const userIds = (await Drink.findById(drinkId)).favoritedBy;

    if (userIds.includes(userId)) {
      return res.status(409).send({
        message: 'The cocktail is already added to favorites',
      });
    }

    const updatedFavoriteDrinks = await Drink.findByIdAndUpdate(
      drinkId,
      { $push: { favoritedBy: userId } },
      { new: true }
    );

    if (updatedFavoriteDrinks === null) {
      return res.status(404).json({ message: 'Favorites drinks not found' });
    }

    return res.status(200).json({
      message: 'Successfully added to your favorite cocktails',
    });
  } catch (error) {
    next(error);
  }
};

const removeFromFavorite = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { drinkId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(drinkId)) {
      return res
        .status(400)
        .json({ message: 'Incorrectly entered data. Cocktail id is expected' });
    }

    const drink = await Drink.findById(drinkId);

    const isInFavoriteDrinks = drink.favoritedBy.includes(userId);

    if (!isInFavoriteDrinks) {
      return res.status(403).json({
        message:
          'The user does not have such a cocktail in his favorite cocktails',
      });
    }

    const deletedDrink = await Drink.findByIdAndUpdate(
      drinkId,
      { $pull: { favoritedBy: userId } },
      { new: false }
    );

    if (deletedDrink === null) {
      return res.status(404).json({ message: 'Favorites drinks not found' });
    }

    return res.status(200).json({
      message: 'The cocktail was successfully removed',
      drinkId,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getFavoriteDrinks, addToFavoriteDrinks, removeFromFavorite };
