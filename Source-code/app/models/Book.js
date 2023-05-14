const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const slug = require('mongoose-slug-generator');

const BookSchema = new Schema(
    {
        book_title: {
            type: String,
            required: true,
        },
        publication_date: {
            type: Date,
            required: true,
        },
        cover_image: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        sale_price: {
            type: Number,
        },
        inventory_count: {
            type: Number,
            required: true,
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
    }
);

mongoose.plugin(slug);

module.exports = mongoose.model('Book', BookSchema);
