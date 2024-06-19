const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const User = require("../models/user")
const UserProfile = require("../models/userProfile")

const signup = async (req, res) => {
    const { username, email, password, phone, fullName } = req.body
    if (!username || !email || !password || !phone)
        return res.json({error: "missing request data"})

    const hashedPassword = await bcrypt.hash(password, 10)

    await User.create({
        username,
        email,
        password: hashedPassword,
        phone
    })
        .then(async user => {

            await UserProfile.create({
                username,
                fullName,
                friends: [],
                likes: [],
                options: {
                    posts: {
                        visibility: "public"
                    },
                    profile: {
                        visibility: "public",
                        contact: "private",
                    }
                }
            })
                .then(userprofile => {
                    req.user = { username}
                    generateToken(req, res)
                })
        })
        .catch(err => {
            // signup error one se01
            console.log('Error (se01): ', err)
            res.json({ error: err.message})
        })
}

const login = async (req, res) => {
    const { password } = req.body

    let user = null;

    if (req.body.hasOwnProperty('email')) //login with email
        user = await User.findOne({ email: req.body.get("email") })
    if (req.body.hasOwnProperty('username')) //login with email
        user = await User.findOne({ email: req.body.get("username") })

    if (user == null) return res.json({ error: "user not found"})

    const validPassword = await bcrypt.compare(password, user.password)

    if (validPassword) {
        const username = user.username
        req.user = { username }
        generateToken(req, res)
    }
    else {
        return res.json({error : "username/password wrong"})
    }
}

const refreshToken = async (req, res) => {

}



const generateToken = (req, res) => {
    return true
}


module.exports =  {
    login,
    signup,
    refreshToken
}