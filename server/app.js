const express = require('express')
const app = express()
const cors = require('cors') //This is to allow for the API to communicate with the frontend
const bodyParser = require('body-parser')
require('dotenv').config() //This is to load all .env variables into the app
const authRoutes = require("./routes/auth")
const messagesRoutes = require("./routes/messages")
const errorHandler = require("./handlers/error")
const { loginRequired, ensureCorrectUser } = require("./middleware/auth")
const { db } = require('./models/user')

const port = 3000



app.use(cors())
app.use(bodyParser.json())
app.use("/api/auth", authRoutes)
app.use("/api/users/:id/messages", loginRequired, ensureCorrectUser, messagesRoutes)

app.use(function(req, res, next) {
    let err = new Error("Not Found")
    err.status = 404;
    next(err)
})
app.use(errorHandler)

app.get("/api/messages", loginRequired, async function(req, res, next){
    try {
        let messages = await db.Messages.find()
        .sort({createAt: "desc"})
        .populate("user", {
            username: true,
            profileImageUrl: true
        })
        return res.status(200).json(messages)
    } catch (error) {
        return next(error)
    }
})
app.get('/', function(req, res) {res.send('Hello World!')})

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))