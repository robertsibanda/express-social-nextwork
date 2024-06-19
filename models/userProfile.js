const mongoose = require("mongoose")
const {mongo} = require("mongoose");

const userProfile = mongoose.Schema({
    username: {
        type: String,
        required: true
    },

    fullName: {
        type: String,
        required: true
    },

    friends: {
        type: Array,
    },

    likes: {
        type: [],
        required: true
    },

    blocked: [],

    options: {
        // user preferences
        posts : {

        },

        profile: {

        }
    }
})

module.exports = mongoose.model("user_profiles", userProfile)