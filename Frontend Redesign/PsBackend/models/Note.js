const mongoose = require('mongoose');

const NoteSchema = new mongoose.Schema({
    title: String,
    content: String
}, { collection: 'listofnotes' });

const Note = mongoose.model('Note', NoteSchema);

module.exports = Note;
