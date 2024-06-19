const UserProfile = require("../models/userProfile");


const addFriends = async (req, res) => {
    // add new friend
    const friendUsername = req.params.user
    let friend = getProfile(friendUsername)
    let currentUser = getProfile(req.user)

    if (friend == null || undefined) {
        return res.json({error: "user dos not exist"})
    }

    if (friend.blocked.includes(currentUser.username) ||
        friend.friends.requests.includes(currentUser.username)  ||
            friend.friends.requested.includes(currentUser.username) ||
                friend.friends.accepted.includes(currentUser.username)) {
        return res.json({ error : "cannot send friend request"})
    }

    if (currentUser.blocked.includes(friend.username)) {
        return res.json({ error : "cannot send request to blocked user"})
    }

    // add user to request list
    await UserProfile.findOneAndUpdate(
        { username: friend.username},
        { "friends.requests":
                [...friend.friends.requests, currentUser.username] })
        .then(async userprofile => {
            await UserProfile.findOneAndUpdate(
                { username: currentUser.username},
                { "friends.requested":
                        [...currentUser.friends.requested, friend.username]},
                {new: true,runValidators: true})
                .then(user => {
                    return res.json({ success : "friend request submitted"})
                })
        })
        .catch(err => {
            return res.json({ error: err.message})
        })


    //TODO create middleware for notifications


}


const respondRequest = async (req, res) => {
    // accept or reject friends request

    const userToRespond = req.params.user
    let friend = getProfile(userToRespond)
    let currentUser = getProfile(req.user)

    if (!friend.friends.requested.includes(req.user.username)){
        return res.json({ error: "friend request not found"})
    }

    else {
        await UserProfile.findOneAndUpdate(
            { username: friend.username},
            {
                "friends.accepted":
                    [...friend.friends.accepted, currentUser.username],
                "friends.requested":
                    friend.friends.requested.filter(user => {
                        if (user !== currentUser.username) {
                            return user
                        }
                })
            })
            .then(async userprofile => {
                await UserProfile.findOneAndUpdate(
                    { username: currentUser.username },
                    {
                        "friends.accepted":
                            [...currentUser.friends.accepted, friend.username],
                        "friends.requests":
                            currentUser.friends.requests.filter(user => {
                                if (user !== friend.username) {
                                    return user
                                }
                        })
                    },

                )
                    .then(userprofile => {
                        return res.json({ success : `accepted ${friend.username} friends request`})
                    })
            })
            .catch(err => {
                console.log(`Error friends-request-01 ${err}`)
                return res.json({ error: err.message})
            })
    }
}


const cancelRequest = async (req, res) => {
    // cancel already sent requests
    const userToRespond = req.params.user
    let friend = getProfile(userToRespond)
    let currentUser = getProfile(req.user)

    await UserProfile.findOneAndUpdate(
        { username: friend.username},
        {"friends.requests":
                friend.friends.accepted.filter(user => {
                    if (user !== currentUser.username){
                        return user
                    }
                })})
        .then(async userprofile => {
            await UserProfile.findOneAndUpdate(
                {username: currentUser.username},
                {"friends.requested":
                        currentUser.friends.requested.filter(user => {
                            if (user !== friend.username) {
                                return user
                            }
                        })})
                .then(userprofile => {
                    return res.json({ success: `friend request to ${friend.username} cancelled`})
                })
        })
        .catch(err => {
            console.log(`Error: cancel-request-error-01 ${err}`)
            return res.json({ error : err.message})
        })
}

const getAllFriends = async (req, res) => {
    // get list of all friends
    await UserProfile.findOne({ username: req.user})
        .then(user => {
            res.json({ friends: user.friends })
        })
        .catch(err => {
            console.log(`Error get-all-friends-01 ${err}`)
            res.json({ error: err.me})
        })
}


const deleteFriend = async (req, res) => {
    // delete already added friend
    const friendUsername = req.params.user
    let friend = getProfile(friendUsername)
    let currentUser = getProfile(req.user)

    await UserProfile.findOneAndUpdate(
        { username: currentUser.username},
        { "friends.accepted":
                currentUser.friends.accepted.filter(user => {
                    if (user !== friendUsername) {
                        return user
                    }
                    })})
        .then(async user => {
            await UserProfile.findOneAndUpdate(
                {username: friendUsername},
                { "friends.accepted":
                        friend.friends.accepted.filter(user => {
                            if (user !== currentUser.username){
                                return user
                            }
                        })}
            )
                .then(user => {
                    return res.json({ success: `Friends ${friendUsername} deleted`})
                })
        })
        .catch(err => {
            console.log(`Error : delete-friend-error-01 ${err}`)
            return res.json({ error : err.message})
        })
}


const getProfile = async (username) => {
    return UserProfile.findOne({username});
}




module.exports = {
    addFriends,
    respondRequest,
    getAllFriends,
    deleteFriend,
    cancelRequest
}
