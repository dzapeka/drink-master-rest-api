const express = require('express');
const router = express.Router();

const drinkController = require('../controllers/drink');
const favoriteControler = require('../controllers/favorite');

router.get('/favorite', favoriteControler.getFavoriteDrinks);
router.post('/favorite', favoriteControler.addToFavoriteDrinks);
router.delete('/favorite/:drinkId', favoriteControler.removeFromFavorite);

router.get('/mainpage', drinkController.getRandomDrinks);
router.get('/search', drinkController.search);
router.get('/popular', drinkController.getPopularDrinks);
router.get('/:id', drinkController.getDrinkById);

module.exports = router;
