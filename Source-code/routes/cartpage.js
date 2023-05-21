const express = require('express');
const router = express.Router();
const cartPageController = require('../app/controllers/CartPageController');

router.get('/', cartPageController.index);
router.post('/', cartPageController.updateCart);
router.post('/remove/:cartItemId', cartPageController.removeCartItem);
router.post('/increase/:cartItemId', cartPageController.increaseCartItem);
router.post('/decrease/:cartItemId', cartPageController.decreaseCartItem);
router.post('/story-sells/cart/update/:cartItemId', cartPageController.updateCartItemQuantity);


module.exports = router;
