const express = require('express')
const router = express.Router()

const homePageController = require('../app/controllers/HomaPageController')

router.use('/',  homePageController.index)

module.exports = router