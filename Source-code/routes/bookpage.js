const express = require('express');
const router = express.Router();
const bookPageController = require('../app/controllers/BookPageController');

router.get('/:slug', bookPageController.index);
router.post('/:slug', bookPageController.addToCart);

module.exports = router;
