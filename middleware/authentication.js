const jwt = require("jsonwebtoken")

require("dotenv").config()

const authentication = async (req, res, next) => {
    // handle authorization of all requests
    const authHeaders = req.headers.authorization
    if (!(authHeaders.split(" ").length === 2))
        return res.json({ error : "authentication headers missing"})

    const token = authHeaders.split(" ")[1]

    await jwt.verify(token, process.env.ACCESS_SECRET,
        (err, data) => {
        if (err)
            return res.json({ error: "authentication error [jwt-invalid]"})
        const { user } = data
        req.user =  user
        next()
        })
}

module.exports = authentication