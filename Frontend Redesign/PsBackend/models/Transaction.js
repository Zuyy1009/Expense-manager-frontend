const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
    type: String,
    amount: Number,
    category: String,
    date: String,
    note: String,
    dateCreated: String
}, { collection: 'listoftrans' });

const Transaction = mongoose.model('Transaction', TransactionSchema);
