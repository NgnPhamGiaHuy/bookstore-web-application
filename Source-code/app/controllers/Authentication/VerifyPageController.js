require("dotenv").config();

const Token = require('../../models/Token');
const Customer = require('../../models/Customer');

const sendEmail = require('../../utils/sendEmail');

class VerifyPageController {
    async getVerify(req, res) {
        try {
            const customerId = req.params.customerId;
            const verificationCode = req.body.verificationCode;
            const combinedCode = verificationCode.join('');

            const customer = await Customer.findById(customerId);

            if (!customer.customer_verified) {
                const token = await Token.findOne({customerId: customer._id});

                if (combinedCode === token.token) {
                    customer.customer_verified = true;
                    await customer.save();
                    return res.redirect('/user/login');
                } else {
                    return res.redirect(`/user/verify/${encodeURIComponent(customer._id)}`);
                }
            } else {
                throw new Error('Customer is already verified');
            }
        } catch (error) {
            console.error('Error occurred while logging in:', error);
            return res.send(`<script>alert("Error occurred while logging in: ${error.message}"); window.location.href = "/user/verify";</script>`);
        }
    }


    async showVerify(req, res) {
        try {
            const customerId = req.params.customerId;
            const customer = await Customer.findById(customerId).select('customer_email');

            const email = customer.customer_email;

            const partialEmail = email.replace(/(\w{3})[\w.-]+@([\w.]+\w)/, "$1***@$2");

            res.render('Authentication/verify', {
                email: partialEmail,
                customerId: customerId
            });
        } catch (error) {
            console.log(error);
        }
    }
}

module.exports = new VerifyPageController();