const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CartSchema = new Schema(
    {
        customer: {
            type: Schema.Types.ObjectId,
            ref: 'Customer',
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Cart', CartSchema);
