const router = require("express").Router()
const { createPost, getPost, getAllPosts,updatePost, deletePost, likePost,} = require("../controllers/posts")
const authMiddleware = require("../middleware/authentication")

router.route("/posts")
    .get(authMiddleware, getAllPosts)
    .post(authMiddleware, createPost)

router.route("/posts/:id")
    .get(authMiddleware, getPost)
    .put(authMiddleware, updatePost)
    .delete(authMiddleware, deletePost)
    .patch(authMiddleware,likePost)

module.exports = router