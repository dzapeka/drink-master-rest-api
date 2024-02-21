const express = require('express');
const drinkController = require('../controllers/drink');

const router = express.Router();

router.get('/mainpage', drinkController.getRandomDrinks);
router.get('/search', drinkController.search);
router.get('/:id', drinkController.getDrinkById);

module.exports = router;
