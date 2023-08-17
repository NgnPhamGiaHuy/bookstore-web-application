const Cart = require('../../models/Cart');
const Customer = require("../../models/Customer");
const CartItem = require('../../models/CartItem');

const fs = require('fs');
const path = require('path');
const countriesList = require('countries-list').countries;

const calculateTotal = require('../../utils/calculateTotal');
const Book = require("../../models/Book");


class UserPageController {
    async renderUserInterface(req, res, next) {
        try {
            const customerId = req.session.customerId;
            const customerData = await Customer.findById(customerId);

            let cart;
            let cartItems = [];
            let totalQuantity = 0;

            if (customerId) {
                cart = await Cart.findOne({customer: customerId})
                    .populate("customer")
                    .lean()
                    .exec();

                if (cart) {
                    cartItems = await CartItem.find({cart: cart._id})
                        .populate("book")
                        .lean()
                        .exec();
                    totalQuantity = await calculateTotal.calculateTotalQuantity(cartItems);
                }
            }

            res.render('user/user', {
                customerData, totalQuantity, numberOfOrders: 0, numberOfWishlist: 0
            });
        } catch (error) {
            next(error);
        }
    }

    async renderAdminInterface(req, res, next) {
        try {
            const customerId = req.session.customerId;
            const customerData = await Customer.findById(customerId);

            const customersPerPage = 12;
            const page = parseInt(req.query.page) || 1;
            const skip = (page - 1) * customersPerPage;


            const orderBy = req.query.orderby || "";

            const sort = {};
            switch (orderBy) {
                case "popularity":
                    sort.sale_count = -1;
                    break;
                case "rating":
                    sort.rating = -1;
                    break;
                case "date":
                    sort.updatedAt = -1;
                    break;
                case "price":
                    sort.sale_price = {$gt: 0} ? 1 : {$gt: 0, $ne: null} ? -1 : {
                        $gt: 0, $ne: null, $exists: false,
                    } ? 1 : {$gt: 0, $ne: null, $exists: false} ? -1 : 0;
                    break;
                case "price-desc":
                    sort.sale_price = {$gt: 0} ? -1 : {$gt: 0, $ne: null} ? 1 : {
                        $gt: 0, $ne: null, $exists: false,
                    } ? -1 : {$gt: 0, $ne: null, $exists: false} ? 1 : 0;
                    break;
                default:
                    break;
            }

            const [customers, totalCustomers] = await Promise.all([Customer.find().sort(sort).skip(skip).limit(customersPerPage), Book.countDocuments(),]);


            const totalPages = Math.ceil(totalCustomers / customersPerPage);


            let cart;
            let cartItems = [];
            let totalQuantity = 0;

            if (customerId) {
                cart = await Cart.findOne({customer: customerId})
                    .populate("customer")
                    .lean()
                    .exec();

                if (cart) {
                    cartItems = await CartItem.find({cart: cart._id})
                        .populate("book")
                        .lean()
                        .exec();
                    totalQuantity = await calculateTotal.calculateTotalQuantity(cartItems);
                }
            }

            res.render('user/user', {
                customerData, totalQuantity, numberOfOrders: 0, numberOfWishlist: 0
            });
        } catch (error) {
            next(error);
        }
    }

    async update(req, res, next) {
        try {
            const customerId = req.session.customerId;
            const {
                customer_firstName,
                customer_lastName,
                day,
                month,
                year,
                gender,
                nationality,
                phoneNo,
                email
            } = req.body;

            const customerData = await Customer.findByIdAndUpdate(customerId, {
                customer_firstName,
                customer_lastName,
                customer_birthday: new Date(year, month - 1, day),
                customer_gender: gender,
                customer_nationality: nationality,
                customer_phoneNo: phoneNo,
                customer_email: email,
            }, {new: true});

            if (req.files && req.files.avatar) {
                const file = req.files.avatar;

                const avatarDirectory = path.join(__dirname, '..', '..', 'public', 'img', 'User');
                const avatarFileName = `Avatar_${customerId}${path.extname(file.name)}`;
                const avatarPath = path.join(avatarDirectory, avatarFileName);

                if (!fs.existsSync(avatarDirectory)) {
                    fs.mkdirSync(avatarDirectory, {recursive: true});
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

    async getCustomerDataAndCartDetails(req, res, next) {
        const customerId = req.session.customerId;

        let cartItems = [];
        let totalQuantity = 0;

        if (customerId) {
            const cart = await Cart.findOne({customer: customerId}).lean().exec();

            if (cart) {
                cartItems = await CartItem.find({cart: cart._id}).populate("book").lean().exec();
                totalQuantity = calculateTotal.calculateTotalQuantity(cartItems);
            }
        }

        const customerData = await Customer.findById(customerId).lean().exec();
        return {customerData, totalQuantity};
    }
}

module.exports = new UserPageController();
