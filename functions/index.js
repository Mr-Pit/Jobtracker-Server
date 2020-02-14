const functions = require("firebase-functions")

const app = require("express")()

const FBAuth = require("./utility/fbAuth")

const { getAllJobs, postOneJob } = require("./handlers/jobs")
const { signup, login } = require("./handlers/users")

// Initialize Firebase

// job route
app.get("/jobs", getAllJobs)
app.post("/job", FBAuth, postOneJob)
// users route
app.post("/signup", signup)
app.post("/login", login)

exports.api = functions.https.onRequest(app)
