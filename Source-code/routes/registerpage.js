const express = require('express')
const router = express.Router()

const registerPageController = require('../app/controllers/RegisterPageController')

router.use('/',  registerPageController.index)

module.exports = router