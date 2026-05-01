const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
    userId: mongoose.Schema.Types.ObjectId,
    type: String,
    amount: Number,
    category: String,
    date: String,
    note: String,
    dateCreated: String
}, { collection: 'listoftrans' });

const Transaction = mongoose.model('Transaction', TransactionSchema);

module.exports = Transaction;
