require("dotenv").config();

const Token = require('../../models/Token');
const Customer = require('../../models/Customer');

const bcrypt = require('bcrypt');
const sendEmail = require("../../utils/sendEmail");

class RegisterPageController {
    async getRegister(req, res, next) {
        try {
            const {name, email, password} = req.body;

            const existingCustomer = await Customer.findOne({customer_email: email}).exec();
            if (existingCustomer) {
                return res.send(`<script>alert("The email '${email}' is already registered. Please use a different email."); window.location.href = "/user/register";</script>`);
            }

            const saltRounds = 10;
            const hashPassword = await bcrypt.hash(password, saltRounds);

            const {firstName, lastName} = sliceName(name);
            const customer = await new Customer({
                customer_email: email,
                customer_password: hashPassword,
                customer_fname: firstName,
                customer_lname: lastName,
            }).save();

            const randomNumber = Math.floor(100000 + Math.random() * 900000); // Generate a random 6-digit number
            const token = await new Token({
                customerId: customer._id, token: randomNumber.toString(),
            }).save();

            await sendEmail(lastName, email, token);

            req.session.isRegistered = true;

            return res.redirect(`/user/verify/${encodeURIComponent(customer._id)}`);
        } catch (error) {
            console.error('Error occurred while registering:', error);
            return res.send(`<script>alert("Error occurred while registering: ${error.message}"); window.location.href = "/user/register";</script>`);
        }
    }

    async showRegister(req, res) {
        res.render('Authentication/register');
    }
}

function sliceName(name) {
    let firstName = '';
    let lastName = '';

    const nameParts = name.split(' ');
    if (nameParts.length > 1) {
        firstName = nameParts.slice(0, -1).join(' ');
        lastName = nameParts[nameParts.length - 1];
    } else {
        lastName = name;
    }

    return {
        firstName, lastName,
    }
}

module.exports = new RegisterPageController();
