const homePageRouter = require('./homepage')
const shopPageRouter = require('./shoppage')
const cartPageRouter = require('./cartpage')
const wishPageRouter = require('./wishpage')
const loginPageRouter = require('./loginpage')
const registerPageRouter = require('./registerpage')

function route(app) {
    app.use('/register', registerPageRouter)
    app.use('/login', loginPageRouter)
    app.use('/cart', cartPageRouter)
    app.use('/wishlist', wishPageRouter)
    app.use('/shop', shopPageRouter)
    app.use('/', homePageRouter)
}

module.exports = route;
