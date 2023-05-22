const homePageRouter = require('./homepage');
const shopPageRouter = require('./shoppage');
const cartPageRouter = require('./cartpage');
const wishPageRouter = require('./wishpage');
const bookPageRouter = require('./bookpage');
const accessPageRouter = require('./accesspage');
const checkoutPageRouter = require('./checkoutpage');

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
    app.use('/story-sells/checkout', requireLogin, checkoutPageRouter);
    app.use('/story-sells', requireLogin, homePageRouter);
    app.use('/wishlist', requireLogin, wishPageRouter);

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
