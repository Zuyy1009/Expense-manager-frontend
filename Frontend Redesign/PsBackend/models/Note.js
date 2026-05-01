const mongoose = require('mongoose');

const NoteSchema = new mongoose.Schema({
    userId: mongoose.Schema.Types.ObjectId,
    title: String,
    content: String
}, { collection: 'listofnotes' });

const Note = mongoose.model('Note', NoteSchema);

module.exports = Note;
