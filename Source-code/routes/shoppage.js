const express = require('express');
const router = express.Router();

const shopPageController = require('../app/controllers/ShopPageController');

router.get('/', shopPageController.index);

module.exports = router;
