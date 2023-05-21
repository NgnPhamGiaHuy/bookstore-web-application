const Cart = require('../models/Cart');
const CartItem = require('../models/CartItem');
const BookAuthor = require('../models/BookAuthor');

class CartPageController {
    static calculateSubtotalAndTotal(cartItems) {
        let subtotal = 0;
        let total = 0;

        for (const cartItem of cartItems) {
            if (cartItem.book.sale_price > 0) {
                cartItem.subtotal = cartItem.book.sale_price * cartItem.quantity;
                subtotal += cartItem.subtotal;
                total += cartItem.subtotal;
            } else {
                cartItem.subtotal = cartItem.book.price * cartItem.quantity;
                subtotal += cartItem.subtotal;
                total += cartItem.subtotal;
            }
        }

        return {
            subtotal: subtotal.toFixed(2), total: total.toFixed(2),
        };
    }

    static calculateTotalQuantity(cartItems) {
        let totalQuantity = 0;

        for (const cartItem of cartItems) {
            totalQuantity += cartItem.quantity;
        }

        return totalQuantity;
    }

    async removeCartItem(req, res, next) {
        try {
            const cartItemId = req.params.cartItemId;
            const deletedCartItem = await CartItem.findByIdAndDelete(cartItemId);

            if (!deletedCartItem) {
                throw new Error('Failed to remove cart item');
            }

            res.json({success: true});
        } catch (error) {
            next(error);
        }
    }

    async updateCartItemQuantity(req, res, next) {
        try {
            const cartItemId = req.params.cartItemId;
            const quantity = req.body.quantity;

            const cartItem = await CartItem.findById(cartItemId);
            if (!cartItem) {
                throw new Error('Cart item not found');
            }

            cartItem.quantity = quantity;
            await cartItem.save();

            const {subtotal, total} = CartPageController.calculateSubtotalAndTotal([cartItem]);

            res.json({success: true, subtotal, total});
        } catch (error) {
            next(error);
        }
    }

    async increaseCartItem(req, res, next) {
        try {
            const cartItemId = req.params.cartItemId;
            const cartItem = await CartItem.findById(cartItemId);

            if (cartItem.quantity < 999) {
                cartItem.quantity += 1;
            } else {
                throw new Error("Too much book quantity");
            }

            await cartItem.save();
            res.json({success: true, quantity: cartItem.quantity});
        } catch (error) {
            next(error);
        }
    }

    async decreaseCartItem(req, res, next) {
        try {
            const cartItemId = req.params.cartItemId;
            const cartItem = await CartItem.findById(cartItemId);

            if (cartItem.quantity > 1) {
                cartItem.quantity -= 1;
            }

            await cartItem.save();
            res.json({success: true, quantity: cartItem.quantity});
        } catch (error) {
            next(error);
        }
    }

    async updateCart(req, res, next) {
        try {
            return res.status(200);

        } catch (error) {
            next(error);
        }
    }

    async index(req, res, next) {
        try {
            const customerId = req.session.customerId;
            const cart = await Cart.findOne({customer: customerId}).populate('customer');

            if (!cart) {
                return res.render('cart', {cartItems: [], subtotal: 0, total: 0, cart: null});
            }

            const cartItems = await CartItem.find({cart: cart._id}).populate('book');

            const bookIds = cartItems.map((cartItem) => cartItem.book._id);

            const bookAuthors = await BookAuthor.find({book: {$in: bookIds}})
                .populate('author')
                .lean();

            const bookAuthorsMap = {};

            for (const bookAuthor of bookAuthors) {
                const bookId = bookAuthor.book.toString();
                const author = bookAuthor.author;
                if (!bookAuthorsMap[bookId]) {
                    bookAuthorsMap[bookId] = [author];
                } else {
                    bookAuthorsMap[bookId].push(author);
                }
            }

            for (const cartItem of cartItems) {
                const bookId = cartItem.book._id.toString();
                const authors = bookAuthorsMap[bookId] || [];
                cartItem.book.authors = authors;
            }

            const {subtotal, total} = CartPageController.calculateSubtotalAndTotal(cartItems);
            const totalQuantity = CartPageController.calculateTotalQuantity(cartItems);

            res.render('cart', {cartItems, subtotal, total, totalQuantity, cart});
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new CartPageController();
