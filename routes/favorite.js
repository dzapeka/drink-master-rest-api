const express = require('express');
const router = express.Router();
const favoriteControler = require('../controllers/favorite');

router.get('/', favoriteControler.getFavoriteDrinks);
router.post('/add', favoriteControler.addToFavoriteDrinks);
router.delete('/remove/:drinkId', favoriteControler.removeFromFavorite);

module.exports = router;
