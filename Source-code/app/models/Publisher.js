const mongoose = require('mongoose')
const Schema = mongoose.Schema

const PublisherSchema = new Schema(
    {
        publisher_name: {
            type: String,
            require: true,
        },
        publisher_location: {
            type: String,
        },
        contact_infomation: {
            type: String,
        }
    }
)

module.exports = mongoose.model('Publisher', PublisherSchema)