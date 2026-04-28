const mongoose = require('mongoose');
const { iconsMap } = require('../storage/iconsList.js');
const { Transaction } = require('../storage/transactionsList.js'); // Import để tính toán số tiền đã tiêu

const BudgetSchema = new mongoose.Schema({
    bid: String,
    category: String,
    month: String,
    year: String,
    limitAmount: Number,
    alertThreshold: Number,
    isActive: Boolean
}, { collection: 'listofbudgs' });

const Budget = mongoose.model('Budget', BudgetSchema);

module.exports = Budget;
