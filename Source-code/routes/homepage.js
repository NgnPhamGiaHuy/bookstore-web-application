const express = require('express')
const router = express.Router()

const homePageController = require('../app/controllers/HomePageController')

router.use('/',  homePageController.index)

module.exports = router