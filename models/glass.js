const mongoose = require('mongoose');

const glassSchema = new mongoose.Schema(
  {
    glass: { type: String, required: true },
  },
  { versionKey: false, timestamps: false }
);

module.exports = mongoose.model('Glass', glassSchema);
