const express = require('express')
const router = express.Router()

const wishPageController = require('../../app/controllers/Shopping/WishPageController')

router.use('/',  wishPageController.index)

module.exports = router


