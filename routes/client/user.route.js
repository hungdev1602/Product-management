const express = require('express')
const router = express.Router()

const controller = require('../../controllers/client/user.controller')

router.get('/register', controller.register)

router.post('/register', controller.registerPost)

router.get('/login', controller.login)

router.post('/login', controller.loginPost)

router.get('/logout', controller.logout)

router.get('/password/forgot', controller.passwordForgot)

router.post('/password/forgot', controller.passwordForgotPost)

router.get('/password/otp', controller.passwordOtp)

router.post('/password/otp', controller.passwordOtpPost)

router.get('/password/reset', controller.passwordReset)

router.post('/password/reset', controller.passwordResetPost)

module.exports = router