const Customer = require('../models/Customer');

class AccessPageController {
    async login(req, res, next) {
        try {
            const { username, password, remember } = req.body;

            // Find the customer based on the provided username
            const customer = await Customer.findOne({ customer_username: username }).exec();

            if (!customer) {
                // No customer found with the provided username
                return res.send('<script>alert("Invalid username."); window.location.href = "/user/login";</script>');
            }

            if (customer.customer_password !== password) {
                // Incorrect password
                return res.send('<script>alert("Invalid password."); window.location.href = "/user/login";</script>');
            }

            // Customer is valid, perform further actions (e.g., session management, redirect to dashboard, etc.)
            req.session.isLoggedIn = true;
            req.session.customer = customer;
            req.session.customerId = customer._id;

            // Set cookie if remember me option is checked
            if (remember) {
                res.cookie('customerId', customer._id, { maxAge: 30 * 24 * 60 * 60 * 1000 }); // Cookie expires in 30 days
            }

            // Redirect to the customer's index page
            return res.redirect(`/story-sells`);
        } catch (error) {
            // Handle the error and provide an appropriate response
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
                firstName = nameParts.slice(0, -1).join(' '); // Join all parts except the last one
                lastName = nameParts[nameParts.length - 1]; // Last part is the last name
            } else {
                lastName = name;
            }

            // Check if the email already exists
            const existingCustomer = await Customer.findOne({ customer_email: email }).exec();
            if (existingCustomer) {
                return res.send(`<script>alert("The email '${email}' is already registered. Please use a different email."); window.location.href = "/user/register";</script>`);
            }

            // Create a new customer
            const customer = new Customer({
                customer_username: email, // You can set the username to be the same as the email
                customer_password: password,
                customer_fname: firstName,
                customer_lname: lastName,
                customer_email: email,
                customer_role: role,
            });

            // Save the customer to the database
            await customer.save();

            // Redirect to the login page
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

module.exports = new AccessPageController();
