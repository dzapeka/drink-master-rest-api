const express = require('express');
const router = express.Router();

const {
  getCategories,
  getIngredients,
  getGlasses,
} = require('../controllers/filters');

router.get('/categories', getCategories);
router.get('/ingredients', getIngredients);
router.get('/glasses', getGlasses);

module.exports = router;
