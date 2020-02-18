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
    createdAt: new Date().toISOString(),
    company: req.body.company,
    position: req.body.position,
    status: req.body.status,
    link: req.body.link
  }

  db.collection("jobs")
    .add(newJob)
    .then(doc => {
      const resJob = newJob
      resJob.jobId = doc.id
      res.json(resJob)
    })
    .catch(err => {
      res.status(500).json({ error: "something went wrong" })
      console.error(err)
    })
}

exports.deleteJob = (req, res) => {
  const document = db.doc(`/jobs/${req.params.jobId}`)
  document
    .get()
    .then(doc => {
      if (!doc.exists) {
        return res.status(404).json({ error: "Job not found" })
      }
      if (doc.data().userId !== req.user.uid) {
        return res.status(403).json({ error: "Unauthorized" })
      } else {
        return document.delete()
      }
    })
    .then(() => {
      res.json({ message: "job deleted successfully" })
    })
    .catch(err => {
      console.error(err)
      return res.status(500).json({ error: err.code })
    })
}

exports.getJob = (req, res) => {
  let jobData = {}
  db.doc(`jobs/${req.params.jobId}`)
    .get()
    .then(doc => {
      if (doc.exists) {
        jobData.jobPostDetails = doc.data()
        return res.json(jobData)
      }
    })
    .catch(err => {
      console.error(err)
      return res.status(500).json({ error: err.code })
    })
}
