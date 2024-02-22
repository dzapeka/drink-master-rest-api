const express = require('express');
const router = express.Router();

const upload = require('../middlewares/upload');

const drinkController = require('../controllers/drink');
const favoriteControler = require('../controllers/favorite');
const ownController = require('../controllers/own');

router.get('/favorite', favoriteControler.getFavoriteDrinks);
router.post('/favorite', favoriteControler.addToFavoriteDrinks);
router.delete('/favorite/:drinkId', favoriteControler.removeFromFavorite);

router.get('/mainpage', drinkController.getRandomDrinks);
router.get('/search', drinkController.search);
router.get('/popular', drinkController.getPopularDrinks);

router.get('/own', ownController.getOwnDrinks);
router.post('/own', upload.single('cocktail'), ownController.addToOwnDrinks);
router.delete('/own/:drinkId', ownController.removeFromOwnDrinks);

router.get('/:id', drinkController.getDrinkById);

module.exports = router;
