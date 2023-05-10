const mongoose = require('mongoose')
const Schema = mongoose.Schema

const CustomerSchema = new Schema(
    {
        customer_username: {
            type: String,
            require: true
        },
        customer_password: {
            type: String,
            require: true
        },
        customer_fname: {
            type: String
        },
        customer_lname: {
            type: String,
            require: true
        },
        customer_email: {
            type: String,
            require: true
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