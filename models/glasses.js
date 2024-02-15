const mongoose = require('mongoose');

const glassesSchema = new mongoose.Schema({
  glass: { type: String, require: true },
});

module.exports = mongoose.model('Glass', glassesSchema);
