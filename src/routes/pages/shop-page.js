const express = require("express");
const router = express.Router();

const shopPageController = require("../../app/controllers/Pages/ShopPageController");

router.get('/', shopPageController.index);
router.post('/', shopPageController.updateShop);
router.post('/addToCart/:bookCartId', shopPageController.addToCart);

module.exports = router;
