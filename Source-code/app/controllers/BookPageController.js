const Book = require('../models/Book');
const Review = require('../models/Review');
const Publisher = require('../models/BookPublisher');
const BookGenre = require('../models/BookGenre');
const BookAuthor = require('../models/BookAuthor');
const BookPublisher = require('../models/BookPublisher');

class BookPageController {
    async index(req, res, next) {
        try {
            const books = await Book.find();

            if (books.length === 0) {
                return res.status(404).json({ error: 'No books found' });
            }

            const book = books[0]; // Select the first book object

            const bookGenres = await BookGenre.find({ book: book._id }).populate({
                path: 'genre',
                model: 'Genre',
                select: 'genre_name',
            });

            const bookAuthors = await BookAuthor.find({ book: book._id }).populate({
                path: 'author',
                model: 'Author',
                select: 'author_name',
            });

            const bookPublishers = await BookPublisher.find({ book: book._id }).populate({
                path: 'publisher',
                model: 'Publisher',
                select: 'publisher_name',
            });

            const bookReviews = await Review.find({ book: book._id });

            const bookRatings = await Review.aggregate([
                { $match: { book: book._id } },
                {
                    $group: {
                        _id: '$book',
                        averageRating: { $avg: '$rating' },
                    },
                },
            ]);

            const genres = bookGenres.map((bg) => bg.genre.genre_name);
            const authors = bookAuthors.map((bg) => bg.author.author_name);
            const publishers = bookPublishers.map((bp) => bp.publisher.publisher_name);
            const reviews = bookReviews;

            const bookRating = bookRatings.find((rating) => rating._id.equals(book._id));
            const averageRating = bookRating ? bookRating.averageRating : 0;
            const ratingWidth = (averageRating / 5) * 100;

            const bookData = {
                genres,
                authors,
                publishers,
                _id: book._id,
                price: book.price,
                book_title: book.book_title,
                sale_price: book.sale_price,
                cover_image: book.cover_image,
                book_description: book.description,
                rating: averageRating,
                ratingWidth,
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
