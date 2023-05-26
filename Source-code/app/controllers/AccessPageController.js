const Customer = require('../models/Customer');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');

class AccessPageController {
    async login(req, res, next) {
        try {
            const { username, password, remember } = req.body;

            const customer = await Customer.findOne({ customer_username: username }).exec();

            if (!customer) {
                return res.send('<script>alert("Invalid username."); window.location.href = "/user/login";</script>');
            }

            const passwordMatch = await bcrypt.compare(password, customer.customer_password);
            if (!passwordMatch) {
                return res.send('<script>alert("Invalid password."); window.location.href = "/user/login";</script>');
            }

            req.session.isLoggedIn = true;
            req.session.customer = customer;
            req.session.customerId = customer._id;

            if (remember) {
                res.cookie('customerId', customer._id, { maxAge: 30 * 24 * 60 * 60 * 1000 }); // Cookie expires in 30 days
            }

            return res.redirect(`/story-sells`);
        } catch (error) {
            console.error('Error occurred while logging in:', error);
            return res.send(`<script>alert("Error occurred while logging in: ${error.message}"); window.location.href = "/user/login";</script>`);
        }
    }

    async register(req, res) {
        try {
            const { name, email, password, role, agree } = req.body;

            if (!name || !email || !password || !role || !agree) {
                return res.send('<script>alert("Please fill in all the required fields and agree to the terms."); window.location.href = "/user/register";</script>');
            }

            let firstName = '';
            let lastName = '';

            // Split the name into first name and last name
            const nameParts = name.split(' ');
            if (nameParts.length > 1) {
                firstName = nameParts.slice(0, -1).join(' ');
                lastName = nameParts[nameParts.length - 1];
            } else {
                lastName = name;
            }

            // Check if the email already exists
            const existingCustomer = await Customer.findOne({ customer_email: email }).exec();
            if (existingCustomer) {
                return res.send(`<script>alert("The email '${email}' is already registered. Please use a different email."); window.location.href = "/user/register";</script>`);
            }

            // Generate a unique confirmation token
            const confirmationToken = generateToken();

            // Create a new customer with confirmation token
            const customer = new Customer({
                customer_username: email,
                customer_password: password,
                customer_fname: firstName,
                customer_lname: lastName,
                customer_email: email,
                customer_role: role,
                confirmation_token: confirmationToken,
                confirmation_token_expires: Date.now() + 180000, // Token expires in 3 minutes (180,000 milliseconds)
            });

            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds);
            customer.customer_password = hashedPassword;

            await customer.save();

            return res.redirect('/user/login');
        } catch (error) {
            console.error('Error occurred while registering:', error);
            return res.send(`<script>alert("Error occurred while registering: ${error.message}"); window.location.href = "/user/register";</script>`);
        }
    }

    showLogin(req, res) {
        res.render('login');
    }

    showRegister(req, res) {
        res.render('register');
    }
}

function generateToken() {
    // Generate a random alphanumeric token
    const length = 30;
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let token = '';
    for (let i = 0; i < length; i++) {
        token += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return token;
}

module.exports = new AccessPageController();
