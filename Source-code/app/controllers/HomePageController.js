const geoip = require('geoip-lite');
const Book = require('../models/Book');
const Genre = require('../models/Genre');
const Author = require('../models/Author');
const Review = require('../models/Review');
const BookGenre = require('../models/BookGenre');
const BookAuthor = require('../models/BookAuthor');
const generateDummyData = require('../../config/database/dataGenerator');

class HomePageController {
    async index(req, res, next) {
        try {
            // Generate dummy data


            // Retrieve all books
            const books = await Book.find();

            // Retrieve genres for each book
            const bookIds = books.map((book) => book._id);

            const customerData = req.session.customer;
            const {city, zipCode} = getCityAndZipCode(req);

            const totalBooks = await Book.countDocuments();
            const totalAuthors = await Author.countDocuments();
            const totalGenres = await Genre.find().distinct('genre_name');


            const bookGenres = await BookGenre.find({book: {$in: bookIds}})
                .populate({
                    path: 'genre', model: 'Genre',
                });

            // Retrieve authors for each book
            const bookAuthors = await BookAuthor.find({book: {$in: bookIds}})
                .populate({
                    path: 'author', model: 'Author', select: 'author_name', // Only select the 'author_name' field
                });

            // Retrieve ratings for each book
            const bookRatings = await Review.aggregate([{$match: {book: {$in: bookIds}}}, {
                $group: {
                    _id: '$book', averageRating: {$avg: '$rating'},
                },
            },]);

            // Prepare book data
            const bookData = books.map((book) => {
                const genres = bookGenres
                    .filter((bg) => bg.book.equals(book._id))
                    .map((bg) => bg.genre.genre_name);

                const authors = bookAuthors
                    .filter((ba) => ba.book.equals(book._id))
                    .map((ba) => ba.author.author_name);

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
                    price: book.price,
                    sale_price: book.sale_price,
                    book_title: book.book_title,
                    cover_image: book.cover_image,
                    description: book.description,
                    sale_count: book.sale_count,
                    publication_date: book.publication_date,
                    inventory_count: book.inventory_count,
                };
            });

            // Sort books by sale_count in descending order
            const sortedBooks = [...bookData].sort((a, b) => b.sale_count - a.sale_count);

            // Get the 5 books with the highest sale_count
            const bestSaleBooks = sortedBooks.slice(0, 5);

            // Get the book with the best sale_count change within a week
            const currentWeekBestSaleBooks = sortedBooks.slice(0, 6);

            // Find recent books by createdAt
            const recentBooks = [...bookData].sort((a, b) => a.createdAt - b.createdAt);

            // Sort books by inventory_count in ascending order and have high review
            const trendBooks = [...bookData].sort((a, b) => {
                // Sort by inventory_count in ascending order
                if (a.inventory_count !== b.inventory_count) {
                    return a.inventory_count - b.inventory_count;
                }

                // If inventory_count is the same, sort by review rating in descending order
                if (a.rating !== b.rating) {
                    return b.rating - a.rating;
                }

                // If both inventory_count and rating are the same, sort by price in ascending order
                return a.price - b.price;
            });

            // Sort books by the range of price and sale_price, and createdAt being new
            const onSaleBooks = bookData.filter((book) => book.sale_price);

            const topRatedBooks = [...bookData].sort((a, b) => {
                // Compare the ratings first
                if (a.rating > b.rating) {
                    return -1; // a comes before b
                } else if (a.rating < b.rating) {
                    return 1; // b comes before a
                } else {
                    // If the ratings are the same, compare the number of reviews
                    if (a.rating > b.rating) {
                        return -1; // a comes before b
                    } else if (a.rating < b.rating) {
                        return 1; // b comes before a
                    } else {
                        return 0; // Keep the order as-is
                    }
                }
            });

            const randomSaleBooks = sortedBooks.slice(0, 3);

            return res.render('index', {
                city: city,
                zipCode: zipCode,
                customerData: customerData,

                totalBooks: totalBooks,
                totalGenres: totalGenres,
                totalAuthors: totalAuthors,

                trendBooks: trendBooks,
                sortedBooks: sortedBooks,
                onSaleBooks: onSaleBooks,
                recentBooks: recentBooks,
                booksOfAll: bestSaleBooks,
                topRatedBooks: topRatedBooks,
                randomSaleBooks: randomSaleBooks,
                currentWeekBestSaleBooks: currentWeekBestSaleBooks,
            });

        } catch (error) {
            // Handle the error
            console.error(error);
            return res.status(500).json({error: 'Internal server error'});
        }
    }
}

const getCityAndZipCode = (req) => {
    let city = '';
    let zipCode = '';

    // Check if running on localhost
    if (req.hostname === 'localhost' || req.hostname === '127.0.0.1') {
        // Set a default city and ZIP code for testing on localhost
        city = 'Vung Tau';
        zipCode = '780000';
    } else {
        // Retrieve the user's IP address from the request
        const ipAddress = req.ip;

        // Perform IP geolocation
        const geo = geoip.lookup(ipAddress);

        // Extract the city and ZIP code from the geolocation data
        city = geo?.city || '';
        zipCode = geo?.zip || '';
    }

    return {city, zipCode};
};

module.exports = new HomePageController();
