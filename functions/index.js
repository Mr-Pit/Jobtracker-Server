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

const db = admin.firestore()

app.get("/jobs", (req, res) => {
  db.collection("jobs")
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
  db.collection("jobs")
    .add(newJob)
    .then(doc => {
      res.json({ message: `document ${doc.id} created successfully` })
    })
    .catch(err => {
      res.status(500).json({ error: "something went wrong" })
      console.error(err)
    })
})

const isEmail = email => {
  const regEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  if (email.match(regEx)) return true
  else return false
}

const isEmpty = string => {
  if (string.trim() === "") return true
  else return false
}

app.post("/signup", (req, res) => {
  const newUser = {
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword
  }

  let errors = {}
  if (isEmpty(newUser.email)) {
    errors.email = "Must not be empty"
  } else if (!isEmail(newUser.email)) {
    errors.email = "Must be a valid email"
  }

  if (isEmpty(newUser.password)) errors.password = "Must not be empty"
  if (newUser.password !== newUser.confirmPassword)
    errors.confirmPassword = "Passwords must match"

  if (Object.keys(errors).length > 0) return res.status(400).json(errors)

  let token, userId
  firebase
    .auth()
    .createUserWithEmailAndPassword(newUser.email, newUser.password)
    .then(data => {
      userId = data.user.uid
      return data.user.getIdToken()
    })
    .then(idToken => {
      token = idToken
      const userCredentials = {
        email: newUser.email,
        createdAt: new Date().toISOString(),
        userId
      }
      return db.doc(`/users/${userId}`).set(userCredentials)
    })
    .then(() => {
      return res.status(201).json({ token })
    })
    .catch(err => {
      console.error(err)
      if (err.code === "auth/email-already-in-use") {
        return res.status(400).json({ email: `email is already in use` })
      } else {
        return res.status(500).json({ error: err.code })
      }
    })
})

exports.api = functions.https.onRequest(app)
