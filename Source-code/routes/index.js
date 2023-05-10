const homePageRouter = require('./homepage');
const shopPageRouter = require('./shoppage');
const cartPageRouter = require('./cartpage');
const wishPageRouter = require('./wishpage');
const accessPageRouter = require('./accesspage');

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
    // Apply the requireLogin middleware to the home page route
    app.use('/story-sells', requireLogin, homePageRouter);
    app.use('/story-sells/shop', requireLogin, shopPageRouter);
    app.use('/wishlist', requireLogin, wishPageRouter);
    app.use('/cart', requireLogin, cartPageRouter);
    app.use('/', accessPageRouter);

    // Redirect the root URL to the login page
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
