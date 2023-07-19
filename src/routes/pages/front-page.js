const express = require('express');
const router = express.Router();

const frontPageController = require('../../app/controllers/Pages/FrontPageController');

router.get('/', frontPageController.index);
router.post('/', frontPageController.updateHome);
router.post('/addToCart/:bookCartId', frontPageController.addToCart);

module.exports = router;
