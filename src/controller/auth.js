const { response } = require('../helpers/standardResponse')
const { createUsers, getUserByEmail } = require('../models/users')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { APP_KEY } = process.env
const { validationResult } = require('express-validator')

exports.register = async (req, res) => {
  const err = validationResult(req)
  const data = req.body
  if (!err.isEmpty()) {
    return response(res, err.array()[0].msg, null, 400)
  }
  data.password = await bcrypt.hash(data.password, await bcrypt.genSalt())
  createUsers(data, (err, results) => {
    if (!err) {
      if (results.affectedRows) {
        return response(res, 'registration successfully', null, 200)
      } else {
        return response(res, 'registration failed', null, 400)
      }
    } else {
      return response(res, 'Internal server error', null, 500)
    }
  })
}

exports.login = (req, res) => {
  const { email, password } = req.body
  const err = validationResult(req)
  if (!err.isEmpty()) {
    return response(res, err.array()[0].msg, null, 400)
  }
  getUserByEmail(email, async (err, results) => {
    if (!err) {
      if (results.length < 1) {
        return response(res, 'email or password is false', null, 401)
      } else {
        const user = results[0]
        const compare = await bcrypt.compare(password, user.password)
        if (compare) {
          const payload = { id: user.id, email: user.email }
          const token = jwt.sign(payload, APP_KEY, { expiresIn: '2 day' })
          return response(res, 'Login success', { token }, 200)
        } else {
          return response(res, 'email or password is false', null, 401)
        }
      }
    }
  })
}
