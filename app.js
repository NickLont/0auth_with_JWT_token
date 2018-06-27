// Express configuration

const express = require('express')
// const helpPage = require('')
const path = require('path')
const fs = require('fs')
const app = express()
const userAuthRoutes = require('./routes/userAuth')
const nbaStatsRoutes = require('./routes/nbaStats')
const bodyParser = require('body-parser')
const bearerToken = require('express-bearer-token')

// Registration of middleware for express configuration

// Logger for timestamp and method whenever we get an API call
app.use((req, res, next) => {
  const now = new Date().toString()
  const colouredLog = `\x1b[36mTimestamp\x1b[0m: ${now.toString()} \n\x1b[31mMethod\x1b[0m: ${req.method} \n\x1b[34mPATH\x1b[0m: ${req.url}\n`
  console.log(colouredLog)
  const log = `\nTimestamp: ${now.toString()} \nMethod: ${req.method} \nPATH: ${req.url}\n`
  fs.appendFile('server.log', log, (err) => {
    if (err) {
      console.log('Unable to append to server.log')
    }
  })
  next()
})
app.use(express.static(path.resolve(__dirname, 'public'))) // set the static directory for our public files
// Take token from:
// header Authentication: Bearer :token OR access_token: :token in header OR body and put it in req.token
app.use(bearerToken())
// Body parser to validate req. object
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

// Maintenance html serve
// app.use((req, res, next) => {
//   res.sendFile(path.resolve('./views/maintenance.html'))
//   next()
//   // TODO add a check to .env file for maintenance
// })

app.use('/user', userAuthRoutes)
app.use('/', nbaStatsRoutes)

module.exports = app
