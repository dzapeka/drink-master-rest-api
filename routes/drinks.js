const express = require('express');
const router = express.Router();

const upload = require('../middlewares/upload');

const drinkController = require('../controllers/drink');
const favoriteController = require('../controllers/favorite');

router.get('/favorite', favoriteController.getFavoriteDrinks);
router.post('/favorite/add', favoriteController.addToFavoriteDrinks);
router.delete(
  '/favorite/remove/:drinkId',
  favoriteController.removeFromFavorite
);

router.get('/mainpage', drinkController.getRandomDrinks);
router.get('/search', drinkController.search);
router.get('/popular', drinkController.getPopularDrinks);

router.get('/own', drinkController.getOwnDrinks);
router.post(
  '/own/add',
  upload.single('drinkThumb'),
  drinkController.addOwnDrink
);
router.delete('/own/remove/:drinkId', drinkController.removeFromOwnDrinks);

router.get('/:id', drinkController.getDrinkById);

module.exports = router;
