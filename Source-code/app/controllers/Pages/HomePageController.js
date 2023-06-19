const geoip = require("geoip-lite");
const Cart = require("../../models/Cart");
const Book = require("../../models/Book");
const Genre = require("../../models/Genre");
const Author = require("../../models/Author");
const Review = require("../../models/Review");
const CartItem = require("../../models/CartItem");
const BookGenre = require("../../models/BookGenre");
const BookAuthor = require("../../models/BookAuthor");

const generateDummyData = require("../../../config/database/dataGenerator");
const calculateTotal = require('../../utils/calculateTotal');


class HomePageController {
    static getCityAndZipCode(req) {
        let city;
        let zipCode;

        if (req.hostname === "localhost" || req.hostname === "127.0.0.1") {
            city = "Vung Tau";
            zipCode = "780000";
        } else {
            const ipAddress = req.ip;
            const geo = geoip.lookup(ipAddress);
            city = geo?.city || "";
            zipCode = geo?.zipCode || "";
        }

        return {city, zipCode};
    }

    async updateHome(req, res, next) {
        try {
            res.redirect("/story-sells");
        } catch (error) {
            next(error);
        }
    }

    async addToCart(req, res, next) {
        try {
            const bookId = req.params.bookCartId;
            const customerId = req.session.customerId;
            let cart = customerId ? await Cart.findOne({customer: customerId}) : null;

            const book = await Book.findById(bookId);

            if (!book) {
                return res.status(404).json({error: "Book not found"});
            }

            let cartItem;

            if (cart) {
                cartItem = await CartItem.findOne({cart: cart._id, book: book._id});

                if (cartItem) {
                    cartItem.quantity += 1;
                } else {
                    cartItem = new CartItem({
                        cart: cart._id, book: book._id, quantity: 1,
                    });
                }

                await cartItem.save();

                if (!cart.items) {
                    cart.items = [];
                }

                cart.items.push(cartItem._id);
                await cart.save();
            } else {
                const newCart = new Cart({customer: customerId});
                await newCart.save();

                cartItem = new CartItem({
                    cart: newCart._id, book: book._id, quantity: 1,
                });
                await cartItem.save();
            }
            return res.status(200).json({success: true});
        } catch (error) {
            next(error);
        }
    }

    async index(req, res) {
        try {
            const books = await Book.find({}, "book_title cover_image price sale_price inventory_count sale_count")
                .lean()
                .exec();
            const bookIds = books.map((book) => book._id);
            const customerId = req.session.customerId;
            const {city, zipCode} = HomePageController.getCityAndZipCode(req);

            const countPromises = [await Book.countDocuments().lean().exec(), await Author.countDocuments().lean().exec(), await Genre.countDocuments().lean().exec(),];
            const [totalBooks, totalAuthors] = await Promise.all(countPromises);
            const totalGenres = await Genre.find().distinct("genre_name");

            const bookGenrePromise = BookGenre.find({book: {$in: bookIds}})
                .populate("genre", "genre_name")
                .lean()
                .exec();

            const bookAuthorPromise = BookAuthor.find({book: {$in: bookIds}})
                .populate({path: "author", model: "Author", select: "author_name"})
                .lean()
                .exec();

            const reviewPromise = Review.aggregate([{$match: {book: {$in: bookIds}}}, {
                $group: {
                    _id: "$book", averageRating: {$avg: "$rating"},
                },
            },]).exec();

            const [bookGenres, bookAuthors, bookRatings] = await Promise.all([bookGenrePromise, bookAuthorPromise, reviewPromise,]);

            const bookData = books.map((book) => {
                const genres = bookGenres
                    .filter((bg) => bg.book.equals(book._id))
                    .map((bg) => bg.genre.genre_name);

                const authors = bookAuthors
                    .filter((ba) => ba.book.equals(book._id))
                    .map((ba) => ba.author.author_name);

                const bookRating = bookRatings.find((rating) => rating._id.equals(book._id));
                const rating = bookRating ? parseFloat(bookRating.averageRating.toFixed(2)) : 0;
                const ratingWidth = rating * 20;

                return {
                    genres,
                    authors,
                    rating,
                    ratingWidth,
                    reviews: [],
                    _id: book._id,
                    price: book.price,
                    sale_price: book.sale_price,
                    book_title: book.book_title,
                    cover_image: book.cover_image,
                    sale_count: book.sale_count,
                    publication_date: book.publication_date,
                    inventory_count: book.inventory_count,
                };
            });

            const sortedBooks = [...bookData].sort((a, b) => b.sale_count - a.sale_count);
            const bestSaleBooks = sortedBooks.slice(0, 5);
            const currentWeekBestSaleBooks = sortedBooks
                .sort((a, b) => b.updatedAt - a.updatedAt)
                .slice(0, 6);

            const recentBooks = [...bookData].sort((a, b) => a.createdAt - b.createdAt);

            const trendBooks = [...bookData].sort((a, b) => {
                if (a.inventory_count !== b.inventory_count) {
                    return a.inventory_count - b.inventory_count;
                }
                if (a.rating !== b.rating) {
                    return b.rating - a.rating;
                }
                return a.price - b.price;
            });

            const onSaleBooks = bookData.filter((book) => book.sale_price);

            const topRatedBooks = [...bookData].sort((a, b) => {
                if (a.rating > b.rating) {
                    return -1;
                } else if (a.rating < b.rating) {
                    return 1;
                } else {
                    return b.reviews.length - a.reviews.length;
                }
            });

            const randomSaleBooks = sortedBooks.slice(0, 3);

            let cart = null;
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

            const searchResultList = res.locals.searchResultList || [];

            return res.render("Home/homepage", {
                city,
                zipCode,
                totalBooks,
                totalGenres,
                totalAuthors,
                trendBooks,
                sortedBooks,
                onSaleBooks,
                recentBooks,
                topRatedBooks,
                totalQuantity,
                randomSaleBooks,
                booksOfAll: bestSaleBooks,
                currentWeekBestSaleBooks,
                searchResultList: searchResultList,
                customerData: req.session.customer,
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({error: "Internal server error"});
        }
    }
}

module.exports = new HomePageController();
