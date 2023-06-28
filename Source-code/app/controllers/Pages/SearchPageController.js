const Cart = require("../../models/Cart");
const Book = require("../../models/Book");
const Author = require("../../models/Author");
const Review = require("../../models/Review");
const CartItem = require("../../models/CartItem");
const Customer = require("../../models/Customer");
const BookAuthor = require("../../models/BookAuthor");

const calculateTotal = require('../../utils/calculateTotal');

class SearchPageController {
    async search(req, res) {
        try {
            const searchTerm = req.body.searchTerm ? req.body.searchTerm.toString() : '';
            const encodedSearchTerm = encodeURIComponent(searchTerm);
            return res.redirect(`/story-sells/search?searchTerm=${encodedSearchTerm}`);
        } catch (error) {
            console.error('Error searching for books:', error);
            return res.status(500).json({error: 'Internal server error'});
        }
    }

    async index(req, res) {
        try {
            const customerId = req.session.customerId;
            const searchTerm = req.query.searchTerm ? decodeURIComponent(req.query.searchTerm.toString()) : '';

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

            const [books, totalBooks] = await Promise.all([Book.find({book_title: {$regex: searchTerm, $options: 'i'}})
                .sort(sort)
                .skip(skip)
                .limit(booksPerPage) // Limit the number of books per page
                .lean()
                .exec(), Book.countDocuments({book_title: {$regex: searchTerm, $options: 'i'}}) // Get the total count of books
            ]);

            const bookIds = books.map((book) => book._id);

            const bookAuthorsPromise = BookAuthor.find({book: {$in: bookIds}})
                .populate({path: 'author', model: 'Author', select: 'author_name'})
                .lean()
                .exec();

            const bookAuthors = await bookAuthorsPromise;

            const authorIds = bookAuthors.map((ba) => ba.author._id);

            const authors = await Author.find({
                $or: [{_id: {$in: authorIds}}, {author_name: {$regex: searchTerm, $options: 'i'}}]
            })
                .lean()
                .exec();

            const searchResults = await Promise.all(books.map(async (book) => {
                const bookAuthorsData = await Promise.all(bookAuthors
                    .filter((ba) => ba.book.equals(book._id))
                    .map(async (ba) => {
                        const author = await Author.findById(ba.author);
                        return author.author_name;
                    }));

                const reviews = await Review.find({book: book._id})
                    .lean()
                    .exec();

                const ratingSum = reviews.reduce((sum, review) => sum + review.rating, 0);
                const averageRating = ratingSum / reviews.length;
                const rating = parseFloat(averageRating.toFixed(2));
                const ratingWidth = rating * 20;

                return {
                    _id: book._id,
                    cover_image: book.cover_image,
                    book_title: book.book_title,
                    description: book.description,
                    publication_date: book.publication_date,
                    price: book.price,
                    sale_price: book.sale_price,
                    inventory_count: book.inventory_count,
                    sale_count: book.sale_count,
                    authors: bookAuthorsData,
                    reviews,
                    rating,
                    ratingWidth,
                };
            }));

            let cart = null;
            let cartItems = [];
            let totalQuantity = 0;
            const totalPages = Math.ceil(totalBooks / booksPerPage);

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

            const customerData = await Customer.findById(customerId)

            return res.render('Search/search', {
                orderBy, searchTerm, searchResults, authors, totalPages, customerData, totalQuantity, currentPage: page,
            });
        } catch (error) {
            console.error('Error searching for books:', error);
            return res.status(500).json({error: 'Internal server error'});
        }
    }
}

module.exports = new SearchPageController();