const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OrderItemSchema = new Schema(
    {
        order: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Order',
                required: true,
            },
        ],
        book: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Book',
                required: true,
            },
        ],
        quantity: {
            type: Number,
            required: true,
        },
        price: {
            type: Number,
            required: true,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Order_Item', OrderItemSchema);
