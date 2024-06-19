const UserProfile = require("../models/userProfile")


const reduceProfile = (profile, keys) => {
    let user_profile = {}
    keys.forEach(key => {
        user_profile[key] = profile[key]
    })

    return user_profile;
}

const getProfile = (profile) => {
    const requiredKeys = ["fullName", "friends", "likes"]
    return reduceProfile(profile, requiredKeys)
}


const viewProfile = async (req, res) => {
    const username = req.params.username
    if (req.user === username) {
        await UserProfile.findOne({ username })
            .then(profile => {
                return res.json({ profile : getProfile(profile)})
            })
            .catch(err => {
                console.log(`Error view-profile1 : ${err} `)
                return res.json({ error: err.message})
            })
    }

    else {
        await UserProfile.findOne({ username})
        .then(profile => {
            const profileOptions  = profile.options.profile

            if (profile == null || undefined)
                return res.json({ error : "profile not found" })

            else if (profileOptions.visibility === "private") {
                if (profile.friends.includes(req.user)) {  // list(profile.friends).indexOf(req.user)
                    return res.json({ profile: getProfile(profile)})
                }
                return res.json({ error : "profile is private" })
            }
            return res.json({
                profile: getProfile(profile)
            })

        })
    }
}

const blockProfile = async (req, res) => {
    const username = req.params.username

    const { block } = req.body
    if (!block) return res.json({ error : "missing request data"})

    if (block === true) {
        let currentUser = await UserProfile.findOne({ username: req.user})
        await UserProfile.findOne({ username})
            .then(async userProfile => {
                if (userProfile == null || undefined)
                    return res.json({ error: "profile not found" })
                UserProfile.findOneAndUpdate({ username: currentUser.username},
                    { blocked: [...currentUser.blocked, userProfile.username]})
                    .then(userprofile => {
                        return res.json({ success: `blocked : ${userprofile.username}`})
                    })
            })
            .catch(err => {
                console.log("Error : block-1", err)
                return res.json({ error: err.message})
            })
    }
    else if (block === false) {
        let currentUser = await UserProfile.findOne({ username: req.user})
        await UserProfile.findOne({ username})
            .then(async userProfile => {
                if (userProfile == null || undefined)
                    return res.json({ error: "profile not found" })
                UserProfile.findOneAndUpdate({ username: currentUser.username},
                    { blocked: currentUser.blocked.filter(user => {
                        if (user !== userProfile.username) {
                            return user
                        }
                        })})
                    .then(userprofile => {
                        return res.json({ success: `blocked : ${userprofile.username}`})
                    })
            })
            .catch(err => {
                console.log("Error : block-1", err)
                return res.json({ error: err.message})
            })
    }

}

module.exports = {
    viewProfile,
    blockProfile
}