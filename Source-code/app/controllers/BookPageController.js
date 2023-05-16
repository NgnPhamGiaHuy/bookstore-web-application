const Book = require('../models/Book');
const Review = require('../models/Review');
const BookGenre = require('../models/BookGenre');
const BookAuthor = require('../models/BookAuthor');
const BookPublisher = require('../models/BookPublisher');

class BookPageController {
    async index(req, res, next) {
        try {
            const bookId = req.params.slug;
            const book = await Book.findById(bookId);

            if (!book) {
                return res.status(404).json({ error: 'Book not found' });
            }

            const formatDate = (date) => {
                const options = {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: 'numeric',
                };
                return date.toLocaleDateString('en-US', options);
            };

            const bookGenres = await BookGenre.find({ book: book._id }).populate('genre');
            const bookReviews = await Review.find({ book: book._id }).populate('customer');
            const bookAuthors = await BookAuthor.find({ book: book._id }).populate('author');
            const bookPublishers = await BookPublisher.find({ book: book._id }).populate('publisher');

            const bookRatings = await Review.aggregate([
                { $match: { book: book._id } },
                {
                    $group: {
                        _id: '$book',
                        averageRating: { $avg: '$rating' },
                    },
                },
            ]);

            const customerReview = bookReviews.map((review) => {
                const ratingWidth = review.rating * 20;
                const updatedAt = formatDate(review.updatedAt);
                return {
                    updatedAt,
                    ratingWidth,
                    rating: review.rating,
                    comment: review.comment,
                    customer: review.customer,
                };
            });

            const genres = bookGenres.map((bg) => bg.genre.genre_name);
            const publishers = bookPublishers.map((bp) => bp.publisher);
            const authors = bookAuthors.map((bg) => bg.author.author_name);

            const reviews = bookReviews;
            const bookRating = bookRatings.find((rating) => rating._id.equals(book._id));
            const rating = bookRating ? parseFloat(bookRating.averageRating.toFixed(2)) : 0;
            const ratingWidth = rating * 20;

            const formattedReviews = reviews.map((review) => {
                return {
                    ...review.toObject(),
                    updatedAt: formatDate(review.updatedAt),
                };
            });

            const bookData = {
                genres,
                rating,
                authors,
                publishers,
                ratingWidth,
                customerReview,
                price: book.price,
                book_title: book.book_title,
                sale_price: book.sale_price,
                cover_image: book.cover_image,
                book_reviews: formattedReviews,
                book_description: book.description,
                inventory_count: book.inventory_count,
            };

            res.render('book', {
                bookData,
            });
        } catch (error) {
            next(error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
}

module.exports = new BookPageController();
