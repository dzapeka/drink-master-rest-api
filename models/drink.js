const mongoose = require('mongoose');
const { Schema } = mongoose;

const ingredientSchema = new Schema(
  {
    title: String,
    measure: String,
    ingredientId: {
      type: Schema.Types.ObjectId,
      ref: 'Ingredient',
      required: true,
      auto: false, // Prevents Mongoose from generating _id for this sub-document
    },
  },
  { _id: false } // Prevents Mongoose from generating _id for this sub-schema
);

const drinkSchema = new Schema(
  {
    drink: { type: String },
    drinkAlternate: { type: String },
    tags: { type: String },
    video: { type: String },
    category: { type: String },
    IBA: { type: String },
    alcoholic: { type: String },
    glass: { type: String },
    description: { type: String },
    instructions: { type: String },
    instructionsES: { type: String },
    instructionsDE: { type: String },
    instructionsFR: { type: String },
    instructionsIT: { type: String },
    instructionsRU: { type: String },
    instructionsPL: { type: String },
    instructionsUK: { type: String },
    drinkThumb: { type: String },
    ingredients: [ingredientSchema],
    shortDescription: { type: String },
    favoritedBy: [{ type: Schema.Types.ObjectId, default: [] }],
    ownerId: { type: Schema.Types.ObjectId, default: null },
  },
  { versionKey: false, timestamps: true }
);

module.exports = mongoose.model('Drink', drinkSchema);
