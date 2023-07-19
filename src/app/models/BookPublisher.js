const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BookPublisherSchema = new Schema(
    {
        book: {
            type: Schema.Types.ObjectId,
            ref: 'Book',
            required: true,
        },
        publisher: {
            type: Schema.Types.ObjectId,
            ref: 'Publisher',
            required: true,
        },
    }
);

module.exports = mongoose.model('BookPublisher', BookPublisherSchema);
