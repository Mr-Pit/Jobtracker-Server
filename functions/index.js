const functions = require("firebase-functions")
const admin = require("firebase-admin")

const app = require("express")()

var serviceAccount = require("./admin.json")
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://jobtrackerback.firebaseio.com"
})

const config = {
  apiKey: "AIzaSyDA52rltHRk76oU2HEMEyYqm4Y0vGf6sd0",
  authDomain: "jobtrackerback.firebaseapp.com",
  databaseURL: "https://jobtrackerback.firebaseio.com",
  projectId: "jobtrackerback",
  storageBucket: "jobtrackerback.appspot.com",
  messagingSenderId: "643549026160",
  appId: "1:643549026160:web:335b1600b4a11549ba21b5",
  measurementId: "G-E1B73KCWM7"
}
// Initialize Firebase

const firebase = require("firebase")
firebase.initializeApp(config)

app.get("/jobs", (req, res) => {
  admin
    .firestore()
    .collection("jobs")
    .orderBy("createdAt", "desc")
    .get()
    .then(data => {
      let jobs = []
      data.forEach(doc => {
        jobs.push({
          jobId: doc.id,
          body: doc.data().body,
          createdAt: doc.data().createdAt
        })
      })
      return res.json(jobs)
    })
    .catch(err => console.error(err))
})

app.post("/job", (req, res) => {
  if (req.method !== "POST") {
    return res.status(400).json({ error: "Method not allowed" })
  }
  const newJob = {
    body: req.body.body,
    createdAt: new Date().toISOString()
  }
  admin
    .firestore()
    .collection("jobs")
    .add(newJob)
    .then(doc => {
      res.json({ message: `document ${doc.id} created successfully` })
    })
    .catch(err => {
      res.status(500).json({ error: "something went wrong" })
      console.error(err)
    })
})

app.post("/signup", (req, res) => {})

exports.api = functions.https.onRequest(app)
