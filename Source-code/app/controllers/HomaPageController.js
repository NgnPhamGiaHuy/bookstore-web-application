const Book = require('../models/Book');
const Author = require('../models/Author');

class HomePageController {
  async index(req, res, next) {
    try {
      const books = await Book.find().limit(6).populate('author');

      // Extract the required data
      const bookData = books.map((book, index) => {
        return {
          book_id: book._id,
          cover_image: book.cover_image,
          book_title: book.book_title,
          author_id: book.author._id,
          author_name: book.author.author_name
        };
      });

      // Render the response
      res.render('index', { bookData });
    } catch (error) {
      // Handle the error
    }
  }
}

module.exports = new HomePageController();
