const isEmail = email => {
  const regEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  if (email.match(regEx)) return true
  else return false
}

const isEmpty = string => {
  if (string.trim() === '') return true
  else return false
}

exports.validateSignUpData = data => {
  let errors = {}

  if (isEmpty(data.firstName)) {
    errors.firstName = 'Must not be empty'
  }

  if (isEmpty(data.lastName)) {
    errors.lastName = 'Must not be empty'
  }

  if (isEmpty(data.email)) {
    errors.email = 'Must not be empty'
  } else if (!isEmail(data.email)) {
    errors.email = 'Must be a valid email address'
  }

  if (isEmpty(data.password)) errors.password = 'Must not be empty'
  if (data.password !== data.confirmPassword)
    errors.confirmPassword = 'Passwords must match'

  // cohort validation
  if (isEmpty(data.cohort)) errors.cohort = 'Must not be empty'
  if (data.cohort !== data.cohort.replace(/\D/g, ''))
    errors.cohort = 'Not a valid cohort'
  if (Number(data.cohort) > 100 || Number(data.cohort) < 0) {
    errors.cohort = 'Not a valid cohort'
  }
  // Program validation
  if (isEmpty(data.program)) errors.program = 'Must not be empty'
  if (!(data.program === 'Full Stack' || data.program === 'UX/UI')) {
    errors.program = 'Not a valid program'
  }
  return {
    errors,
    valid: Object.keys(errors).length === 0 ? true : false
  }
}

exports.validateLoginData = data => {
  let errors = {}

  if (isEmpty(data.email)) {
    errors.email = 'Must not be empty'
  } else if (!isEmail(data.email)) {
    errors.email = 'Must be a valid email'
  }
  if (isEmpty(data.password)) errors.password = 'Must not be empty'
  return {
    errors,
    valid: Object.keys(errors).length === 0 ? true : false
  }
}

exports.reduceUserDetails = data => {
  let userDetails = {}

  if (data.linkedIn) {
    if (!isEmpty(data.linkedIn.trim())) {
      if (data.linkedIn.trim().substring(0, 4) !== 'http') {
        userDetails.linkedIn = `http://${data.linkedIn.trim()}`
      } else userDetails.linkedIn = data.linkedIn
    }
  }
  if (data.github) {
    if (!isEmpty(data.github.trim())) {
      if (data.github.trim().substring(0, 4) !== 'http') {
        userDetails.github = `http://${data.github.trim()}`
      } else userDetails.github = data.github
    }
  }
  if (data.website) {
    if (!isEmpty(data.website.trim())) {
      if (data.website.trim().substring(0, 4) !== 'http') {
        userDetails.website = `http://${data.website.trim()}`
      } else userDetails.website = data.website
    }
  }

  if (data.cohort)
    userDetails.cohort = Number(data.cohort.toString().replace(/\D/g, ''))

  if (data.program) userDetails.program = data.program

  return userDetails
}

exports.validateUserDetails = data => {
  let errors = {}
  if (data.cohort > 100 || data.cohort < 0) {
    errors.cohort = 'Not a valid cohort'
  }
  // Program validation
  if (isEmpty(data.program)) errors.program = 'Must not be empty'
  if (!(data.program === 'Full Stack' || data.program === 'UX/UI')) {
    errors.program = 'Not a valid program'
  }
  return {
    errors,
    valid: Object.keys(errors).length === 0 ? true : false
  }
}
