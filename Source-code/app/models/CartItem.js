const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CartItemSchema = new Schema(
    {
        cart: {
            type: Schema.Types.ObjectId,
            ref: 'Cart',
            required: true,
        },
        book: {
            type: Schema.Types.ObjectId,
            ref: 'Book',
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
            default: 1,
        },
        price: {
            type: Number,
            required: true,
            default: 0,
        },
        sale_price: {
            type: Number,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('CartItem', CartItemSchema);
