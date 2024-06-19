const mongoose = require("mongoose");

const database  = (URL) => {
    return mongoose.connect(URL)
        .then(() => {
            console.log("connected to database")
        })
        .catch(err => {
            console.log(err)
        })
}

module.exports = database