const mongoose = require("mongoose")

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

    options: {
        // user preferences
        posts : {

        },

        profile: {
            visibility : "public",

        }
    }
})