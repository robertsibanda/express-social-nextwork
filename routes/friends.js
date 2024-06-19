const router = require("express").Router()
const { addFriends, deleteFriends, respondRequest,getAllFriends} = require("../controllers/friends")
const authMiddleware = require("../middleware/authentication")

router.route("/friends")
    .get(authMiddleware, getAllFriends)
    .post(authMiddleware, addFriends)

router.route("/friends/:id")
    .put(authMiddleware, respondRequest)
    .delete(authMiddleware, deleteFriends)

module.exports = router