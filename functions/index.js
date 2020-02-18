const functions = require("firebase-functions")

const app = require("express")()

const FBAuth = require("./utility/fbAuth")

const { getAllJobs, postOneJob, deleteJob, getJob } = require("./handlers/jobs")
const {
  signup,
  login,
  uploadImage,
  addUserDetails,
  getAuthenticatedUser,
  getAllUsers
} = require("./handlers/users")

// Initialize Firebase

// job route
app.get("/jobs", getAllJobs)
app.get("/job/:jobId", getJob)
app.post("/job", FBAuth, postOneJob)
app.delete("/job/:jobId", FBAuth, deleteJob)
// todo delete job

// users route
app.post("/signup", signup)
app.post("/login", login)
app.post("/user/image", FBAuth, uploadImage)
app.post("/user", FBAuth, addUserDetails)
app.get("/user", FBAuth, getAuthenticatedUser)
app.get("/users", getAllUsers)

exports.api = functions.https.onRequest(app)
