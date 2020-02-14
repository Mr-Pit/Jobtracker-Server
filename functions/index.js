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
          company: doc.data().company,
          position: doc.data().position,
          status: doc.data().status,
          link: doc.data().link,
          createdAt: doc.data().createdAt
        })
      })
      return res.json(jobs)
    })
    .catch(err => console.error(err))
})

const FBAuth = (req, res, next) => {
  let idToken
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    idToken = req.headers.authorization.split("Bearer ")[1]
  } else {
    console.error("No token found")
    return res.status(403).json({ error: "Unauthorized" })
  }
  admin
    .auth()
    .verifyIdToken(idToken)
    .then(decodedToken => {
      req.user = decodedToken
      console.log(decodedToken)
      return next()
    })
    .catch(err => {
      console.error("Error while verifying token", err)
      return res.status(403).json(err)
    })
}

app.post("/job", FBAuth, (req, res) => {
  const newJob = {
    userId: req.user.uid,
    company: req.body.company,
    position: req.body.position,
    status: req.body.status,
    link: req.body.link,
    createdAt: new Date().toISOString()
  }
  db.collection("jobs")
    .add(newJob)
    .then(doc => {
      res.json({
        message: `document ${doc.id} created successfully`
      })
    })
    .catch(err => {
      if (err.code === "auth/argument-error") {
        res.status(500).json({ error: "Invalid token" })
        console.error(err)
      }
      // need to catch error for bad tokens
      res.status(500).json({ error: "Something went wrong" })
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

app.post("/login", (req, res) => {
  const user = {
    email: req.body.email,
    password: req.body.password
  }
  let errors = {}

  if (isEmpty(user.email)) {
    errors.email = "Must not be empty"
  } else if (!isEmail(user.email)) {
    errors.email = "Must be a valid email"
  }
  if (isEmpty(user.password)) errors.password = "Must not be empty"
  if (Object.keys(errors).length > 0) return res.status(400).json(errors)

  firebase
    .auth()
    .signInWithEmailAndPassword(user.email, user.password)
    .then(data => {
      return data.user.getIdToken()
    })
    .then(token => {
      return res.json({ token })
    })
    .catch(err => {
      console.log(err)
      if (err.code === "auth/wrong-password") {
        return res
          .status(403)
          .json({ general: "wrong credentials please try again" })
      }
      return res.status(500).json({ error: err.code })
    })
})

exports.api = functions.https.onRequest(app)
