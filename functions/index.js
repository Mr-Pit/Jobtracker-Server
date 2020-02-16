const functions = require("firebase-functions")

const app = require("express")()

const FBAuth = require("./utility/fbAuth")

const { getAllJobs, postOneJob } = require("./handlers/jobs")
const { signup, login, uploadImage } = require("./handlers/users")

// Initialize Firebase

// job route
app.get("/jobs", getAllJobs)
app.post("/job", FBAuth, postOneJob)
// users route
app.post("/signup", signup)
app.post("/login", login)
app.post("/user/image", FBAuth, uploadImage)

exports.api = functions.https.onRequest(app)
