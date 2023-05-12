const mongoose = require('mongoose')
const Schema = mongoose.Schema
const slug = require('mongoose-slug-generator')

const BookSchema = new Schema(
    {
        book_title: {
            type: String,
            required: true
        },
        author: {
            type: Schema.Types.ObjectId,
            ref: 'Author',
            required: true,
        },
        publisher: {
            type: Schema.Types.ObjectId,
            ref: 'Publisher',
            required: true,
        },
        publication_date: {
            type: Date,
            required: true
        },
        genre: {
            type: Schema.Types.ObjectId,
            ref: 'Genre',
            required: true,
        },
        cover_image: {
            type: String,
            required: true
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
        sale_count: {
            type: Number,
            default: 0,
        },
        description: {
            type: String,
        }
    },
    {
        timestamps: true,
    },
)

BookSchema.pre('save', function (next) {
    const hyphenRegex = /-(.)/g;
    this.cover_image = this.cover_image.replace(hyphenRegex, (_, c) => c.toUpperCase());
    next();
});



mongoose.plugin(slug)

module.exports = mongoose.model('Book', BookSchema)
