const express = require('express')
const router = express.Router()
const authController = require('../controllers/authController')
const {catchErrors} = require('../handlers/errorHandlers')

router.post('/signup', catchErrors(authController.signup))
router.post('/signin', catchErrors(authController.signin))

module.exports = router
