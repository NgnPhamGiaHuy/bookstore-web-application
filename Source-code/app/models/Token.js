const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TokenSchema = new Schema(
    {
        customerId: {
            type: Schema.Types.ObjectId,
            unique: true,
            required: true,
            ref: 'Customer',
        },
        token: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
)

module.exports = mongoose.model("Token", TokenSchema);