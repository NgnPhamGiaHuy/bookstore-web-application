const express = require('express');
const router = express.Router();
const cartPageController = require('../app/controllers/CartPageController');

router.get('/', cartPageController.index);

module.exports = router;
