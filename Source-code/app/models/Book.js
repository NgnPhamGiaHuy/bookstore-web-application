const mongoose = require('mongoose')
const Schema = mongoose.Schema

const BookSchema = new Schema(
    {
        book_title: {
            type: String,
            required: true
        },
        author: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Author',
                require: true,
            }
        ],
        publisher: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Publisher',
                require: true,
            }
        ],
        publication_date: {
            type: Date,
            required: true
        },
        genre: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Genre',
                require: true,
            }
        ],
        cover_image: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true
        },
        sale_price: {
            type: Number
        },
        inventory_count: {
            type: Number,
            required: true
        },
    },
    {
        timestamps: true,
    },
)

module.exports = mongoose.model('Book', BookSchema)
