const Cart = require('../models/Cart');
const CartItem = require('../models/CartItem');

class CartPageController {
    static calculateSubtotalAndTotal(cartItems) {
        let subtotal = 0;
        let total = 0;

        for (const cartItem of cartItems) {
            cartItem.subtotal = cartItem.book.price * cartItem.quantity; // Update the subtotal for each cart item
            subtotal += cartItem.subtotal;
            total += cartItem.subtotal;
        }

        return {
            subtotal: subtotal.toFixed(2),
            total: total.toFixed(2),
        };
    }

    static calculateTotalQuantity(cartItems) {
        let totalQuantity = 0;

        for (const cartItem of cartItems) {
            totalQuantity += cartItem.quantity;
        }

        return totalQuantity;
    }

    async index(req, res, next) {
        try {
            const customerId = req.session.customerId;
            const cart = await Cart.findOne({ customer: customerId }).populate('customer');

            if (!cart) {
                return res.render('cart', { cartItems: [], subtotal: 0, total: 0 });
            }

            const cartItems = await CartItem.find({ cart: cart._id }).populate('book');

            const { subtotal, total } = CartPageController.calculateSubtotalAndTotal(cartItems);
            const totalQuantity = CartPageController.calculateTotalQuantity(cartItems);

            res.render('cart', { cartItems, subtotal, total, totalQuantity });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new CartPageController();
