const Cart = require('../models/Cart');
const CartItem = require('../models/CartItem');
const Customer = require('../models/Customer');
const BookPublisher = require('../models/BookPublisher');
const countriesList = require('countries-list').countries;

class CheckoutController {
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
            const customerData = await Customer.findById(customerId);

            const cart = await Cart.findOne({customer: customerId}).populate('customer');

            const cartItems = await CartItem.find({cart: cart._id}).populate('book');

            const bookIds = cartItems.map((cartItems) => cartItems.book._id);

            const bookPublishers = await BookPublisher.find({book: {$in: bookIds}})
                .populate('publisher')
                .lean();

            const bookPublishersMap = {};

            for (const bookPublisher of bookPublishers) {
                const bookId = bookPublisher.book.toString();
                const publisher = bookPublisher.publisher;

                if (!bookPublishersMap[bookId]) {
                    bookPublishersMap[bookId] = [publisher];
                } else {
                    bookPublishersMap[bookId].push(publisher);
                }
            }

            for (const cartItem of cartItems) {
                const bookId = cartItem.book._id.toString();
                const publishers = bookPublishersMap[bookId] || [];
                cartItem.book.publishers = publishers;
            }

            const {subtotal, total} = CheckoutController.calculateSubtotalAndTotal(cartItems);
            const totalQuantity = CheckoutController.calculateTotalQuantity(cartItems);

            const allCountries = Object.values(countriesList);
            const countryOptions = allCountries
                .map((country) => country.name)

            res.render('checkout', {
                cartItems: cartItems,
                customerData: customerData,
                subtotal,
                total,
                totalQuantity,
                countryOptions,
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new CheckoutController();
