const mongoose = require('mongoose');
const { iconsMap } = require('../storage/iconsList.js');

const CategorySchema = new mongoose.Schema({
    name: String,
    type: String,
    isDefault: Boolean,
    createdAt: String
}, { collection: 'listofcates' });

const Category = mongoose.model('Category', CategorySchema);

module.exports = Category;
