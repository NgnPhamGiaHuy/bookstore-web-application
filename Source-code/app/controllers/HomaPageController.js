const geoip = require('geoip-lite');
const Book = require('../models/Book');
const Genre = require('../models/Genre');
const Author = require('../models/Author');
const Review = require('../models/Review')
const Customer = require('../models/Customer');
const Publisher = require('../models/Publisher');

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

  return { city, zipCode };
};

class HomePageController {
  async index(req, res, next) {
    try {
      const { city, zipCode } = getCityAndZipCode(req);
      const [books, genres, authors, reviews, customers, publishers] = await Promise.all([
        Book.find().limit(6).populate('author'),
        Genre.find(),
        Author.find(),
        Review.find(),
        Customer.find(),
        Publisher.find(),
      ]);

      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);

      const topBooksOfWeek = await Book.find({ createdAt: { $gte: weekAgo } })
        .sort({ sale_count: -1 })
        .limit(6)
        .populate('author');

      const bestSellerBooks = await Book.find()
        .sort({ sale_count: -1 })
        .limit(5)
        .populate('author');

      const totalBooks = await Book.countDocuments();
      const totalAuthor = await Author.countDocuments();

      const bookData = books.map((book) => {
        const genre = genres.find((genre) => genre._id.equals(book.genre._id));
        const author = authors.find((author) => author._id.equals(book.author._id));
        const publisher = publishers.find((publisher) => publisher._id.equals(book.publisher._id));
        const review = reviews.find((review) => review.book.equals(book._id));
        const rating = review ? review.rating : 0;

        return {
          book_id: book._id,
          book_title: book.book_title,
          cover_image: book.cover_image,
          price: book.price,
          sale_price: book.sale_price,
          author_id: author._id,
          author_name: author.author_name,
          genre_id: genre._id,
          genre_name: genre.genre_name,
          publisher_id: publisher._id,
          publisher_name: publisher.publisher_name,
          rating: rating,
          ratingWidth: `${(rating / 5) * 100}%`,
        };
      });

      const customerData = req.session.customer;

      res.render('index', {
        bookData,
        customerData,
        city,
        zipCode,
        totalBooks,
        totalAuthor,
        topBooksOfWeek,
        bestSellerBooks,
      });
    } catch (error) {
      // Handle the error
    }
  }
}

module.exports = new HomePageController();

