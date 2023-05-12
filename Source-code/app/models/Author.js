const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AuthorSchema = new Schema(
    {
        author_name: {
            type: String,
            required: true,
        },
        biography: {
            type: String,
        },
        contact_information: {
            type: String,
        },
    }
);

module.exports = mongoose.model('Author', AuthorSchema);
