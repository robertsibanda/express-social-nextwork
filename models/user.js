const mongoose = require("mongoose")

const User = mongoose.Schema({
    username : {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: true
    },

    email: {
        type: String,
        unique: true
    },

    phone : {
        type: String,
        required: true,
        unique: true,
    },
})

module.exports = mongoose.model('users', User)