const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BookAuthorSchema = new Schema(
    {
        book: {
            type: Schema.Types.ObjectId,
            ref: 'Book',
            required: true,
        },
        author: {
            type: Schema.Types.ObjectId,
            ref: 'Author',
            required: true,
        },
    }
);

module.exports = mongoose.model('BookAuthor', BookAuthorSchema);
