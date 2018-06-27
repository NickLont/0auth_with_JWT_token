const express = require('express')
const router = express.Router()
const authController = require('../controllers/authController')
const {catchErrors} = require('../handlers/errorHandlers')
const verifyToken = require('../helpers/index')

router.get('/', verifyToken, authController.homePage)
// router.get('/nba/allplayers', authController.testPage)

module.exports = router
