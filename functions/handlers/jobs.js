const { db } = require("../utility/admin")

exports.getAllJobs = (req, res) => {
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
    .catch(err => {
      console.error(err)
      res.status(500).json({ error: err.code })
    })
}

exports.postOneJob = (req, res) => {
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
}
