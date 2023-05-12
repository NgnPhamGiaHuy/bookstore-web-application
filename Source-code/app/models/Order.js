const mongoose = require('mongoose')
const Decimal128 = require('mongoose-decimal128').mongoose;

const Schema = mongoose.Schema

const OrderSchema = new Schema(
    {
        customer: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Customer',
                required: true,
            }
        ],
        total_amount: {
            type: Decimal128,
            required: true,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
)

module.exports = mongoose.model('Order', OrderSchema)