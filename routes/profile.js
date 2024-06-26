const router = require("express").Router()
const { viewProfile, blockProfile} = require("../controllers/profiles")
const authMiddleware = require("../middleware/authentication")

router.route("/:username")
    .get(authMiddleware, viewProfile)
    .patch(authMiddleware,blockProfile)

module.exports = router