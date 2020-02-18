const isEmail = email => {
  const regEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  if (email.match(regEx)) return true
  else return false
}

const isEmpty = string => {
  if (string.trim() === "") return true
  else return false
}

exports.validateSignupData = data => {
  let errors = {}
  if (isEmpty(data.email)) {
    errors.email = "Must not be empty"
  } else if (!isEmail(data.email)) {
    errors.email = "Must be a valid email"
  }

  if (isEmpty(data.password)) errors.password = "Must not be empty"
  if (data.password !== data.confirmPassword)
    errors.confirmPassword = "Passwords must match"

  return {
    errors,
    valid: Object.keys(errors).length === 0 ? true : false
  }
}

exports.validateLoginData = data => {
  let errors = {}

  if (isEmpty(data.email)) {
    errors.email = "Must not be empty"
  } else if (!isEmail(data.email)) {
    errors.email = "Must be a valid email"
  }
  if (isEmpty(data.password)) errors.password = "Must not be empty"
  return {
    errors,
    valid: Object.keys(errors).length === 0 ? true : false
  }
}

exports.reduceUserDetails = data => {
  let userDetails = {}

  if (!isEmpty(data.linkedIn.trim())) {
    if (data.linkedIn.trim().substring(0, 4) !== "http") {
      userDetails.linkedIn = `http://${data.linkedIn.trim()}`
    } else userDetails.linkedIn = data.linkedIn
  }
  if (!isEmpty(data.github.trim())) {
    if (data.github.trim().substring(0, 4) !== "http") {
      userDetails.github = `http://${data.github.trim()}`
    } else userDetails.github = data.github
  }
  if (!isEmpty(data.website.trim())) {
    if (data.website.trim().substring(0, 4) !== "http") {
      userDetails.website = `http://${data.website.trim()}`
    } else userDetails.website = data.website
  }
  if (!isEmpty(data.location.trim())) userDetails.location = data.location

  if (!isEmpty(data.cohort.trim())) userDetails.cohort = data.cohort

  if (!isEmpty(data.concentration.trim()))
    userDetails.cohort = data.concentration

  return userDetails
}
