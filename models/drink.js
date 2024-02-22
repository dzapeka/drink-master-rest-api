const mongoose = require('mongoose');
const { Schema } = mongoose;

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
    ingredients: [
      {
        title: { type: String },
        measure: { type: String },
        ingredientId: {
          type: Schema.Types.ObjectId,
          ref: 'Ingredient',
          required: true,
        },
      },
    ],
    shortDescription: { type: String },
    favoritedBy: [{ type: mongoose.Schema.Types.ObjectId, default: [] }],
    ownerId: { type: mongoose.Schema.Types.ObjectId },
  },
  { versionKey: false, timestamps: true }
);

module.exports = mongoose.model('Drink', drinkSchema);
