const Customer = require('../../models/Customer');
const sendEmail = require('../../utils/sendEmail');

require("dotenv").config();
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');

class AccessPageController {
    async verify(req, res) {
        let transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.AUTH_EMAIL,
                password: process.env.AUTH_PASSWORD,
            }
        })

        transporter.verify((error, success) => {
            if (error){
                console.log(error)
            } else {
                console.log("Ready for messages");
                console.log(success);
            }
        })
    }

    showVerify(req, res) {
        res.render('Authentication/verify')
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
