const Book = require('../models/Book');
const Genre = require('../models/Genre');
const Review = require('../models/Review');
const Author = require('../models/Author');
const BookGenre = require('../models/BookGenre');
const BookAuthor = require('../models/BookAuthor');

class ShopPageController {
    async index(req, res, next) {
        try {
            const booksPerPage = 12;
            const page = parseInt(req.query.page) || 1;
            const skip = (page - 1) * booksPerPage;

            const orderBy = req.query.orderby || '';

            const sort = {};
            switch (orderBy) {
                case 'popularity':
                    sort.sale_count = -1;
                    break;
                case 'rating':
                    sort.rating = -1;
                    break;
                case 'date':
                    sort.updatedAt = -1;
                    break;
                case 'price':
                    sort.sale_price = {$gt: 0} ? 1 : {$gt: 0, $ne: null} ? -1 : {
                        $gt: 0, $ne: null, $exists: false
                    } ? 1 : {$gt: 0, $ne: null, $exists: false} ? -1 : 0;
                    break;
                case 'price-desc':
                    sort.sale_price = {$gt: 0} ? -1 : {$gt: 0, $ne: null} ? 1 : {
                        $gt: 0, $ne: null, $exists: false
                    } ? -1 : {$gt: 0, $ne: null, $exists: false} ? 1 : 0;
                    break;
                default:
                    break;
            }

            const [books, totalBooks] = await Promise.all([Book.find().sort(sort).skip(skip).limit(booksPerPage), Book.countDocuments()]);

            const totalPages = Math.ceil(totalBooks / booksPerPage);
            const totalGenres = await Genre.find().distinct('genre_name');

            const bookIds = books.map((book) => book._id);

            const [bookGenres, bookAuthors, bookRatings] = await Promise.all([BookGenre.find({book: {$in: bookIds}}).populate('genre'), BookAuthor.find({book: {$in: bookIds}}).populate('author'), Review.aggregate([{
                $match: {
                    book: {$in: bookIds},
                    rating: {$gt: 0, $ne: null}
                }
            }, {
                $group: {
                    _id: '$book', averageRating: {$avg: '$rating'},
                },
            },])]);

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
                    price: book.sale_price > 0 ? book.sale_price : book.price,
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

            res.render('shop', {
                title: 'Shop', orderBy, currentPage: page, bookData, totalPages, authorData, randomBooks, totalGenres,
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new ShopPageController();

