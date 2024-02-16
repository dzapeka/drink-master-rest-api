const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
  {
    category: { type: String, required: true },
  },
  { versionKey: false, timestamps: false }
);

module.exports = mongoose.model('Category', categorySchema);
