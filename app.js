const express = require("express");
const database = require("./database/database")

const authenticationRoute = require("./routes/authentication")
const postsRoute = require("./routes/posts")
const profileRoute = require("./routes/profile")
const friendsRoute = require("./routes/friends")

const app = express()
app.use(express.json())

app.use("/api/v1/auth", authenticationRoute)
app.use("/api/v1/profile", profileRoute)
app.use("/api/v1/friends", friendsRoute)
app.use("/api/v1/posts", postsRoute)

app.use((req, res) => {
    res.send({error : "page not found"})
})


const databaseUri = "mongodb://localhost:27017"

const server = app.listen(app.get("port"), async function () {
  await database(databaseUri)
    .then(() => {
      console.log("Express server listening on port " + server.address().port);
    })
    .catch((ex) => {
      console.log("Error : ", ex.message);
    });
});
