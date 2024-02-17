const Cocktail = require('../models/cocktail');
const Category = require('../models/category');

const getMainPage = async (req, res, next) => {
  try {
    const numberOfCocktails = Number(req.params.quantity);

    if (
      typeof numberOfCocktails !== 'number' ||
      (numberOfCocktails !== 1 &&
        numberOfCocktails !== 2 &&
        numberOfCocktails !== 3)
    ) {
      res.status(400).json({ message: 'Quantity must be a number(1-3)!' });
    }

    const categories = await Category.find();

    if (categories == null) {
      res.status(404).json({ message: 'Categories not found' });
    }

    const randomCocktails = [];

    function getRandomItemFromArray(arr, count) {
      const shuffled = arr.sort(() => 0.5 - Math.random());
      return shuffled.slice(0, count);
    }

    const randomCategories = getRandomItemFromArray(categories, 3);

    for (const item of randomCategories) {
      const cocktailsInCategory = await Cocktail.find({
        category: item.category,
      }).limit(numberOfCocktails);

      if (cocktailsInCategory == null) {
        res.status(404).json({ message: 'Cocktail not found' });
      }

      randomCocktails.push({
        category: item.category,
        cocktails: cocktailsInCategory,
      });
    }

    res.send(randomCocktails);
  } catch (error) {
    console.log(error);
  }
};

module.exports = { getMainPage };
