const Customer = require('../../models/Customer');

const bcrypt = require('bcrypt');

class LoginPageController {
    async getLogin(req, res, next) {
        try {
            const {email, password, rememberMe} = req.body;

            const customer = await Customer.findOne({customer_email: email}).exec();

            if (!customer) {
                return res.send('<script>alert("Invalid email."); window.location.href = "/user/login";</script>');
            }

            const passwordMatch = await bcrypt.compare(password, customer.customer_password);

            if (!passwordMatch) {
                return res.send('<script>alert("Invalid password."); window.location.href = "/user/login";</script>');
            }

            req.session.isLoggedIn = true;
            req.session.customer = customer;
            req.session.customerId = customer._id;

            if (rememberMe){
                res.cookie('customerId', customer._id, {maxAge: 30 * 24 * 60 * 60 * 1000}); // Cookie expires in 30 days
            }

            return res.redirect('/story-sells');
        } catch (error) {
            console.error('Error occurred while logging in:', error);
            return res.send(`<script>alert("Error occurred while logging in: ${error.message}"); window.location.href = "/user/login";</script>`);
        }
    }

    async showLogin(req, res) {
        res.render('Authentication/login');
    }
}

module.exports = new LoginPageController();