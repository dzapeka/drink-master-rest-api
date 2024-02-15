const mongoose = require('mongoose');

const ingredientsSchema = new mongoose.Schema({
  title: { type: String },
  ingredientThumb: { type: String },
  'thumb-medium': { type: String },
  'thumb-small': { type: String },
  abv: { type: Number },
  alcohol: { type: String },
  description: { type: String },
  type: { type: String },
  flavour: { type: String },
  country: { type: String },
});

module.exports = mongoose.model('Ingredient', ingredientsSchema);
