const Drink = require('../models/drink');
const mongoose = require('mongoose');
const ownDrinkSchema = require('../schemas/ownDrink');

const addToOwnDrinks = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const avatarURL = req.file.path;
    const drink = JSON.parse(req.body.ownDrink);

    const response = ownDrinkSchema.validate(drink, { abortEarly: false });

    if (typeof response.error !== 'undefined') {
      return res.status(400).send({
        message: response.error.details.map(err => err.message).join(', '),
      });
    }

    const isInDrinks = await Drink.findOne({
      drink: { $regex: new RegExp('^' + drink.drink + '$', 'i') },
    });

    if (isInDrinks) {
      return res.status(409).send({
        message: 'The cocktail with that name already exists',
      });
    }

    const updatedDrink = {
      ...drink,
      ownerId: new mongoose.Types.ObjectId(userId),
      drinkThumb: avatarURL,
      favoritedBy: [],
    };

    const createdDrink = await Drink.create(updatedDrink);

    if (createdDrink === null) {
      return res.status(404).json({ message: 'Favorites drinks not found' });
    }

    return res
      .status(200)
      .json({ message: 'Your custom cocktail has been successfully added' });
  } catch (error) {
    console.log(error);
  }
};

const getOwnDrinks = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const ownerDrinks = await Drink.find(
      { ownerId: userId },
      { favoritedBy: 0, ownerId: 0 }
    );

    if (ownerDrinks === null || ownerDrinks.length === 0) {
      return res
        .status(404)
        .json({ message: "You don't have any own drinks yet" });
    }

    return res.status(200).send(ownerDrinks);
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
      return res
        .status(400)
        .json({ message: 'Incorrectly entered data. Cocktail id is expected' });
    }

    const ownDrink = await Drink.findById(drinkId);

    if (ownDrink === null) {
      return res.status(404).json({ message: 'Own drink not found' });
    }

    const isInDrinks = await Drink.findOne({
      ownerId: userId,
      _id: ownDrink._id,
    });

    if (!isInDrinks) {
      return res.status(403).json({
        message: 'The user does not have such a cocktail in his own cocktails',
      });
    }

    await Drink.findByIdAndDelete(drinkId, { new: false });

    return res.status(200).json({
      message: 'The cocktail was successfully removed',
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = { addToOwnDrinks, getOwnDrinks, removeFromOwnDrinks };
