const router = require("express").Router()
const { login, signup, refreshToken} = require("../controllers/authentication")

router.post("/login", login)
router.post("/signup", signup)
router.post("/refresh", refreshToken)

module.exports = router