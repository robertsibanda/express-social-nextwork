const mongoose = require("mongoose");

const UserPost = mongoose.Schema({
    user: {
        type: String,
        required: true
    },

    date: {

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

    comments: [], // comment : { user, content, likes, dislikes}
    options: {
        // "visibility": "friends",
        // deleted_comments : []
    }

})

module.exports = mongoose.model( 'posts', UserPost)