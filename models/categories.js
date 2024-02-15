const mongoose = require('mongoose');

const categoriesSchema = new mongoose.Schema({
  category: { type: String, require: true },
});

module.exports = mongoose.model('Category', categoriesSchema);
