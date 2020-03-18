const functions = require("firebase-functions")
const cors = require("cors")
const app = require("express")()
app.use(cors())
const FBAuth = require("./utility/fbAuth")

const {
  getAllJobs,
  postOneJob,
  deleteJob,
  getJob,
  editOneJob,
  postOneJobFollowUp,
  getAuthenticatedUserFollowups
} = require("./handlers/jobs")
const {
  signup,
  login,
  uploadImage,
  addUserDetails,
  getAuthenticatedUser,
  getAllUsers,
  getUserDetails,
  uploadResume
} = require("./handlers/users")

// Initialize Firebase

// job route
app.get("/jobs", getAllJobs)
app.get("/job/:jobId", getJob)
app.post("/job", FBAuth, postOneJob)
app.delete("/job/:jobId", FBAuth, deleteJob)
app.post("/job/:jobId", FBAuth, editOneJob)
app.post(`/jobs/:jobId/followups`, FBAuth, postOneJobFollowUp)
app.get(`/jobs/:jobId/followups`, getAuthenticatedUserFollowups)
// todo delete job

// users route
app.post("/signup", signup)
app.post("/login", login)
app.post("/user/image", FBAuth, uploadImage)
app.post("/user", FBAuth, addUserDetails)
app.post("/user/resume", FBAuth, uploadResume)
app.get("/user", FBAuth, getAuthenticatedUser)
app.get("/users", getAllUsers)
app.get("/user/:userId", getUserDetails)

exports.api = functions.https.onRequest(app)
