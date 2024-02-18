const express = require('express');
const { getRandomDrinks } = require('../controllers/drink');

const router = express.Router();

router.get('/mainpage', getRandomDrinks);

module.exports = router;
