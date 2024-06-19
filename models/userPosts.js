const mongoose = require("mongoose");

const UserPost = mongoose.Schema({
    user: {
        type: String,
        required: true
    },

    content: {
        type: String,
        required: true
    },

    likes: {
        type: Number,
        required: true,
        default: 0
    },

    dislikes : {
        type: Number,
        required: true,
        default: 0
    },

    comments: {
        // comment : { person, content, time, likes }
        type: [],
        required: true
    },

    options: {
        visibility: "friends",
        deleted_comments : []
    }

})

module.exports = mongoose.model( 'posts', UserPost)