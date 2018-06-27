const axios = require('axios')
const bcrypt = require('bcrypt')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

exports.homePage = (req, res) => {
  res.send('Home page')
}
exports.testPage = async (req, res) => {
  const url = 'http://stats.nba.com/stats/commonallplayers?IsOnlyCurrentSeason=1&Season=2017-18&LeagueID=00'
  const data = await axios.get(url)
    .then(res => res.data)
  console.log('number of players: ', data.resultSets[0].rowSet.length)
  res.send(data)
}
exports.signup = async (req, res) => {
  const userName = await User.findOne({username: req.body.username})
  const userEmail = await User.findOne({email: req.body.email})
  if (userName) {
    return res.status(401).json({
      failed: 'Username already exists'
    })
  }
  if (userEmail) {
    return res.status(401).json({
      failed: 'Email already exists'
    })
  }
  bcrypt.hash(req.body.password, 12, async (err, hash) => {
    if (err) {
      return res.status(500).json({
        error: err
      })
    } else {
      const user = new User({
        username: req.body.username,
        password: hash,
        email: req.body.email
      })
      let result = await user.save()
      console.log('user being added is: ', result)
      res.status(200).json({
        success: 'New user succesfully created'
      })
    }
  })
}
exports.signin = async (req, res) => {
  const user = await User.findOne({username: req.body.username}).exec()
  if (user === null) {
    return res.status(401).json({
      failed: 'No such registered username'
    })
  }
  await bcrypt.compare(req.body.password, user.password, (err, result) => {
    if (err) {
      return res.status(401).json({
        failed: 'Unauthorized access'
      })
    }
    if (result) {
      const jwtToken = jwt.sign({
        email: user.email,
        _id: user._id
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '2h'
      })
      return res.status(200).json({
        success: 'JWT Authorized',
        token: jwtToken
      })
    }
    return res.status(401).json({
      failed: 'Unauthorized access'
    })
  })
}
