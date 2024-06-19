const router = require("express").Router()
const { addFriends, deleteFriend, respondRequest,getAllFriends} = require("../controllers/friends")
const authMiddleware = require("../middleware/authentication")

router.route("/")
    .get(authMiddleware, getAllFriends)

router.route("/:user")
    .post(authMiddleware, addFriends)
    .put(authMiddleware, respondRequest)
    .delete(authMiddleware, deleteFriend)

module.exports = router