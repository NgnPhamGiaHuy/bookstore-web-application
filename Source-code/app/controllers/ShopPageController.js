const Book = require("../models/Book");
const Cart = require("../models/Cart")
const CartItem = require("../models/CartItem");
const Genre = require("../models/Genre");
const Review = require("../models/Review");
const Author = require("../models/Author");
const BookGenre = require("../models/BookGenre");
const BookAuthor = require("../models/BookAuthor");

class ShopPageController {
    static async calculateTotalQuantity(cartItems) {
        let totalQuantity = 0;

        for (const cartItem of cartItems) {
            totalQuantity += cartItem.quantity;
        }

        return totalQuantity;
    }

    async updateShop(req, res, next) {
        try {
            res.redirect("/story-sells/shop");
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

    async index(req, res, next) {
        try {
            const customerId = req.session.customer;

            const booksPerPage = 12;
            const page = parseInt(req.query.page) || 1;
            const skip = (page - 1) * booksPerPage;

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

            const [books, totalBooks] = await Promise.all([Book.find().sort(sort).skip(skip).limit(booksPerPage), Book.countDocuments(),]);

            const totalPages = Math.ceil(totalBooks / booksPerPage);
            const totalGenres = await Genre.find().distinct("genre_name");

            const bookIds = books.map((book) => book._id);

            const [bookGenres, bookAuthors, bookRatings] = await Promise.all([BookGenre.find({book: {$in: bookIds}}).populate("genre"), BookAuthor.find({book: {$in: bookIds}}).populate("author"), Review.aggregate([{
                $match: {
                    book: {$in: bookIds}, rating: {$gt: 0, $ne: null},
                },
            }, {
                $group: {
                    _id: "$book", averageRating: {$avg: "$rating"},
                },
            },]),]);

            const bookData = books.map((book) => {
                const genres = bookGenres
                    .filter((bg) => bg.book.equals(book._id))
                    .map((bg) => bg.genre.genre_name);

                const authors = bookAuthors
                    .filter((bg) => bg.book.equals(book._id))
                    .map((bg) => bg.author.author_name);

                const bookRating = bookRatings.find((rating) => rating._id.equals(book._id));

                let rating = bookRating ? bookRating.averageRating : 0;
                rating = parseFloat(rating.toFixed(2));
                const ratingWidth = rating * 20;

                return {
                    genres,
                    authors,
                    rating,
                    ratingWidth,
                    _id: book._id,
                    updatedAt: book.updatedAt,
                    sale_count: book.sale_count,
                    book_title: book.book_title,
                    sale_price: book.sale_price,
                    cover_image: book.cover_image,
                    price: book.price,
                };
            });

            const randomBooks = Array.from({length: 6}, () => {
                const randomIndex = Math.floor(Math.random() * bookData.length);
                return bookData[randomIndex];
            });

            const authorData = await Author.aggregate([{
                $lookup: {
                    from: "bookauthors", localField: "_id", foreignField: "author", as: "books",
                },
            }, {
                $project: {
                    _id: 1, author_name: 1, numberOfBooks: {$size: "$books"},
                },
            },]);

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
                    totalQuantity = await ShopPageController.calculateTotalQuantity(cartItems);
                }
            }

            res.render("shop", {
                title: "Shop",
                orderBy,
                bookData,
                totalPages,
                authorData,
                randomBooks,
                totalGenres,
                totalQuantity,
                currentPage: page,
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new ShopPageController();
