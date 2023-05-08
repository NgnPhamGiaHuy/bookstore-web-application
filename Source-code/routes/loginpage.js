const express = require('express')
const router = express.Router()

const loginPageController = require('../app/controllers/LoginPageController')

router.use('/',  loginPageController.index)

module.exports = router