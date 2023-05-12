const Book = require('../models/Book');
const Genre = require('../models/Genre');
const Author = require('../models/Author');
const Review = require('../models/Review');
const Publisher = require('../models/Publisher');

class BookPageController {
    async index(req, res, next) {
        try {
            const [books, genres, authors, reviews, publishers] = await Promise.all([
                Book.find().limit(6).populate('author'),
                Genre.find(),
                Author.find(),
                Review.find(),
                Publisher.find(),
            ]);

            const coverImageSlug = req.params.slug;
            const book = books.find((book) => book.cover_image === coverImageSlug);

            if (!book) {
                return res.status(404).json({ error: 'Book not found' });
            }

            const genre = genres.find((genre) => genre._id.equals(book.genre._id));
            const author = authors.find((author) => author._id.equals(book.author._id));
            const publisher = publishers.find((publisher) => publisher._id.equals(book.publisher._id));
            const review = reviews.find((review) => review.book.equals(book._id));
            const rating = review ? review.rating : 0;

            const bookData = {
                book_id: book._id,
                book_title: book.book_title,
                book_description: book.description,
                cover_image: book.cover_image,
                price: book.price,
                sale_price: book.sale_price,
                author_id: author._id,
                author_name: author.author_name,
                genre_id: genre._id,
                genre_name: genre.genre_name,
                publisher_id: publisher._id,
                publisher_name: publisher.publisher_name,
                publisher_location: publisher.publisher_location,
                publisher_contact_information: publisher.contact_information,
                rating: rating,
                ratingWidth: `${(rating / 5) * 100}%`,
            };

            res.render('book', {
                bookData,
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new BookPageController();
