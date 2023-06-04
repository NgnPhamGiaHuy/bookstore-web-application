const Cart = require('../models/Cart');
const Customer = require("../models/Customer");
const CartItem = require('../models/CartItem');

const fs = require('fs');
const path = require('path');
const countriesList = require('countries-list').countries;

class UserPageController {
    static calculateTotalQuantity(cartItems) {
        let totalQuantity = 0;

        for (const cartItem of cartItems) {
            totalQuantity += cartItem.quantity;
        }

        return totalQuantity;
    }

    async index(req, res, next) {
        try {
            const customerId = req.session.customerId;
            const customerData = await Customer.findById(customerId);
            const cart = await Cart.findOne({ customer: customerId }).populate('customer');

            const allCountries = Object.values(countriesList);
            const countryOptions = allCountries.map((country) => country.name);

            const updateSuccess = req.query.updateSuccess === 'true';

            let cartItems = [];
            let totalQuantity = 0;
            if (cart) {
                cartItems = await CartItem.find({cart: cart._id}).populate('book');
                totalQuantity = UserPageController.calculateTotalQuantity(cartItems);
            }

            res.render('user', {
                customerData,
                totalQuantity,
                countryOptions,
                updateSuccess,
            });
        } catch (error) {
            next(error);
        }
    }

    async update(req, res, next) {
        try {
            const customerId = req.session.customerId;
            const { customer_fname, customer_lname, day, month, year, gender, nationality, phoneNo, email } = req.body;

            const customerData = await Customer.findByIdAndUpdate(customerId, {
                customer_fname,
                customer_lname,
                customer_birthday: new Date(year, month - 1, day),
                customer_gender: gender,
                customer_nationality: nationality,
                customer_phoneNo: phoneNo,
                customer_email: email,
            }, { new: true });

            if (req.files && req.files.avatar) {
                const file = req.files.avatar;

                const avatarDirectory = path.join(__dirname, '..', '..', 'public', 'img', 'User');
                const avatarFileName = `Avatar_${customerId}${path.extname(file.name)}`;
                const avatarPath = path.join(avatarDirectory, avatarFileName);

                if (!fs.existsSync(avatarDirectory)) {
                    fs.mkdirSync(avatarDirectory, { recursive: true });
                }

                await file.mv(avatarPath, function (error) {
                    if (error) {
                        console.error('Error moving the file:', error);
                    }
                });

                customerData.customer_avatar = `/img/User/${avatarFileName}`;
                await customerData.save();
            }

            return res.redirect(`/story-sells/user/?updateSuccess=true`);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new UserPageController();
