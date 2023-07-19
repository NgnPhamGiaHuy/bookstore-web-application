const userPageRouter = require('./user/user-page');
const bookPageRouter = require('./pages/book-page');
const shopPageRouter = require('./pages/shop-page');
const homePageRouter = require('./pages/front-page');
const cartPageRouter = require('./shopping/cart-page');
const searchPageRouter = require('./pages/search-page');
const wishPageRouter = require('./shopping/wishlist-page');
const accessPageRouter = require('./authentication/access-page');
const checkoutPageRouter = require('./authentication/checkout-page');

function requireLogin(req, res, next) {
    if (req.session.isLoggedIn || (req.cookies && req.cookies.customerId)) {
        // User is logged in or has the customerId cookie, proceed to the next middleware
        next();
    } else {
        // User is not logged in, redirect to the login page
        return res.redirect('/user/login');
    }
}

function route(app) {
    app.use('/story-sells/shop', requireLogin, shopPageRouter);
    app.use('/story-sells/book', requireLogin, bookPageRouter);
    app.use('/story-sells/cart', requireLogin, cartPageRouter);
    app.use('/story-sells/user/', requireLogin, userPageRouter);
    app.use('/story-sells/search', requireLogin, searchPageRouter);
    app.use('/story-sells/wishlist', requireLogin, wishPageRouter);
    app.use('/story-sells/checkout', requireLogin, checkoutPageRouter);
    app.use('/story-sells', requireLogin, homePageRouter);

    app.use('/', accessPageRouter);

    app.get('/', (req, res) => {
        if (req.session.isLoggedIn || (req.cookies && req.cookies.customerId)) {
            // User is logged in or has the customerId cookie, redirect to the home page
            res.redirect('/story-sells');
        } else {
            // User is not logged in, redirect to the login page
            res.redirect('/user/login');
        }
    });
}

module.exports = route;
