const mongoose = require('mongoose')
const Schema = mongoose.Schema

const CustomerSchema = new Schema(
    {
        customer_username: {
            type: String,
            required: true
        },
        customer_password: {
            type: String,
            required: true
        },
        customer_fname: {
            type: String
        },
        customer_lname: {
            type: String,
            required: true
        },
        customer_email: {
            type: String,
            required: true
        },
        customer_address: {
            type: String
        },
        customer_phoneNo: {
            type: String
        },
        customer_role: {
            type: String,
            enum: ['admin', 'user', 'guest', 'supplier'],
            default: 'user'
        },
    }
)

module.exports = mongoose.model('Customer', CustomerSchema)