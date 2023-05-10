const mongoose = require('mongoose')
const Schema = mongoose.Schema

const FavoriteSchema = new Schema(
    {
        customer: {
            type: Schema.Types.ObjectId,
            ref: 'Customer',
            required: true,
        },
        book: {
            type: Schema.Types.ObjectId,
            ref: 'Book',
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Favorite', FavoriteSchema)