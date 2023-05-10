const mongoose = require('mongoose')
const Decimal128 = require('mongoose-decimal128').mongoose;

const Schema = mongoose.Schema

const OrderItemSchema = new Schema(
    {
        order: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Order',
                require: true,
            }
        ],
        book: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Book',
                require: true,
            }
        ],
        quantity: {
            type: Number,
            require: true,
        },
        price: {
            type: Decimal128,
            required: true,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
)

module.exports = mongoose.model('Order_Item', OrderItemSchema)