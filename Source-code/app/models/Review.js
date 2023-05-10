const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ReviewSchema = new Schema(
    {
        customer: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Customer',
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
        rating: {
            type: Number,
            require: true,
        },
        comment: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
)

module.exports = mongoose.model('Review', ReviewSchema)