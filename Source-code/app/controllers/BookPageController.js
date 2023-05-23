const Book = require('../models/Book');
const Cart = require('../models/Cart');
const CartItem = require('../models/CartItem');
const Review = require('../models/Review');
const BookGenre = require('../models/BookGenre');
const BookAuthor = require('../models/BookAuthor');
const BookPublisher = require('../models/BookPublisher');

class BookPageController {
    static calculateTotalQuantity(cartItems) {
        let totalQuantity = 0;
        for (const cartItem of cartItems) {
            totalQuantity += cartItem.quantity;
        }
        return totalQuantity;
    }

    async index(req, res, next) {
        try {
            const bookId = req.params.slug;
            const bookPromise = Book.findById(bookId).select('book_title price sale_price cover_image description inventory_count');
            const customerId = req.session.customer;

            const [book, cart] = await Promise.all([bookPromise, customerId ? Cart.findOne({customer: customerId}).populate('customer') : null]);

            if (!book) {
                return res.status(404).json({error: 'Book not found'});
            }

            let cartItems = [];
            let totalQuantity = 0;

            if (cart) {
                cartItems = await CartItem.find({cart: cart._id}).populate('book');
                totalQuantity = BookPageController.calculateTotalQuantity(cartItems);
            }

            const [bookGenres, bookAuthors, bookPublishers, bookRatings, bookReviews,] = await Promise.all([BookGenre.find({book: book._id}).populate('genre'), BookAuthor.find({book: book._id}).populate('author'), BookPublisher.find({book: book._id}).populate('publisher'), Review.aggregate([{$match: {book: book._id}}, {
                $group: {
                    _id: null, avgRating: {$avg: '$rating'},
                },
            },]), Review.find({book: book._id}).populate('customer'),]);

            const bookData = {
                id: book._id,
                book_title: book.book_title,
                price: book.price,
                sale_price: book.sale_price,
                cover_image: book.cover_image,
                description: book.description,
                inventory_count: book.inventory_count,
                genres: bookGenres.map((genre) => genre.genre),
                authors: bookAuthors.map((author) => author.author),
                publishers: bookPublishers.map((publisher) => publisher.publisher),
                averageRating: bookRatings.length > 0 ? bookRatings[0].avgRating.toFixed(2) : 0,
                averageRatingWidth: (bookRatings.length > 0 ? bookRatings[0].avgRating : 0) * 20,
                reviews: bookReviews.map((review) => ({
                    id: review._id,
                    customer: review.customer,
                    rating: review.rating,
                    ratingWidth: review.rating * 20,
                    comment: review.comment,
                    createdAt: formatDate(review.createdAt),
                })),
            };

            res.render('book', {
                bookData,
                cartItems,
                totalQuantity,
                addedToCart: req.query.addedToCart === 'true',
                successMessage: 'Book added to cart successfully!',
                outOfInventory: req.query.outOfInventory === 'true',
                outOfInventoryMessage: 'You have over-ordered inventory, please try again!',
            });
        } catch (error) {
            next(error);
        }
    }

    async addToCart(req, res, next) {
        try {
            const customerId = req.session.customer;
            const bookId = req.params.slug;
            const quantity = parseInt(req.body.quantity);

            const cart = customerId ? await Cart.findOne({customer: customerId}) : null;
            const book = await Book.findById(bookId);

            if (!book) {
                return res.status(404).json({error: 'Book not found'});
            }

            if (quantity < 1 || quantity > book.inventory_count) {
                return res.redirect(`/story-sells/book/${bookId}?outOfInventory=true`);
            }

            let cartItem;

            if (cart) {
                cartItem = await CartItem.findOne({cart: cart._id, book: book._id});

                if (cartItem) {
                    cartItem.quantity += quantity;
                } else {
                    cartItem = new CartItem({
                        cart: cart._id, book: book._id, quantity,
                    });
                }

                await cartItem.save();
            } else {
                const newCart = new Cart({customer: customerId});
                await newCart.save();

                cartItem = new CartItem({
                    cart: newCart._id, book: book._id, quantity,
                });
                await cartItem.save();
            }

            return res.redirect(`/story-sells/book/${bookId}?addedToCart=true`);
        } catch (error) {
            next(error);
        }
    }

    async postReview(req, res, next) {
        try {
            const customerId = req.session.customer;
            const bookId = req.params.slug;
            const rating = parseFloat(req.body.rating);
            const comment = req.body.comment;

            const book = await Book.findById(bookId);

            if (!book) {
                return res.status(404).json({error: 'Book not found'});
            }

            const review = new Review({
                book: book._id, customer: customerId, rating, comment,
            });
            await review.save();

            res.status(201).json({message: 'Review posted successfully'});
        } catch (error) {
            next(error);
        }
    }
}

function formatDate(date) {
    const options = {
        year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric',
    };
    return date.toLocaleDateString('en-US', options);
}

module.exports = new BookPageController();
