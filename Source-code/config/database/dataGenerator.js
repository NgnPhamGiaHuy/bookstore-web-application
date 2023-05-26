const mongoose = require('mongoose')
const fs = require('fs');
const path = require('path');
const faker = require('faker');
const Book = require('../../app/models/Book');
const Genre = require('../../app/models/Genre');
const Author = require('../../app/models/Author');
const Review = require('../../app/models/Review');
const Customer = require('../../app/models/Customer');
const Publisher = require('../../app/models/Publisher');
const BookGenre = require('../../app/models/BookGenre');
const BookAuthor = require('../../app/models/BookAuthor');
const BookPublisher = require('../../app/models/BookPublisher');

const generateDummyData = async () => {
    const genreNames = 
    ['Science Fiction','Fantasy','Mystery','Romance','Thriller','Horror','Historical Fiction','Non-fiction','Biography','Self-Help','Dystopian','Adventure','Young Adult','Crime','Contemporary', 'Economic',
    'Novel','Tragedy','Gothic','Picaresque Novel','Comedy','Children\'s Literature','War','Fairy Tales','Comic','Cooking','Art', 'Computer & Technology'];

    const authorNames = 
    ['J.K. Rowling','Stephen King','Agatha Christie','Jane Austen','George Orwell','Mark Twain','Ernest Hemingway','Leo Tolstoy','Charles Dickens','F. Scott Fitzgerald','Toni Morrison','Virginia Woolf',
    'William Shakespeare','Arthur Conan Doyle','John Steinbeck','Kevin Hogan','John C.Maxwell','Cole Nussbaumer Knaflic','Roy Van Den Brink','James Hartley','Janine Kurnoff','Lee Lazarus','James Hartley',
    'Brent Dykes','Stephen Few','Douglas W. Hubbard','Paolo Sironi','Brett King','Aytekin Tank','Shermin Voshmgir','Pooya Farahvash','Beata Lubinska','Moorad Choudhry','Alexander Dill','Jerald E. Pinto',
    'Mark J. P. Anson','Ciby Joseph','Allison Cerra','J.R.R. Tolkien','Emily Brontë','Mary Shelley','Mark Twain','Miguel de Cervantes','Ralph Ellison','O. Henry','Gary Janetti','Nguyễn Nhật Ánh','Tô Hoài',
    'Bảo Ninh','Ngô Tất Tố','Makoto Shinkai','Hayao Miyazaki','Roger Lancelyn Green','Roshani Chokshi','Yoon Ha Lee','Graci Kim','Edith Klose','Edith Klose','Ben Cheetham','Marjorie Swift Doering','Laura Dave',
    'Evelyn Skye','Alice Oseman','Tom King','Brian K Vaughan','Jody Houser','Rachel Smythe','Gwon Gyeoeul','Sarah Andersen','Haruichi Furudate','Kentaro Miura','Aka Akasaka','America\'s Test Kitchen','Tamar Adler',
    'Jeanine Donofrio','Ruth Woods','Jen Racine','Teresa Goodridge','David Grann','Alfred Lansing','Eugene McKinney'];

    const bookTitles = ['Harry Potter and the Philosopher\'s Stone','The Great Gatsby','Security Analysis','To Kill a Mockingbird','Pride and Prejudice','1984','The Catcher in the Rye','The Lord of the Rings','Moby-Dick',
    'The Chronicles of Narnia','The Hobbit','Brave New World','The Da Vinci Code','The Alchemist','The Picture of Dorian Gray','The Adventures of Sherlock Holmes','Standard & Poor\'s Fundamentals of Corporate Credit Analysis',
    'Storytelling with Data: A Data Visualization Guide for Business Professionals','Storytelling with You: Plan, Create, and Deliver a Stellar Presentation','Storytelling with Data: Let\'s Practice!','Academic Writing and Publishing: A Practical Handbook',
    'Examination of the Newborn and Neonatal Health: A Multidimensional Approach','Everyday Business Storytelling: Create, Simplify, and Adapt A Visual Narrative for Any Audience','The Big Book of Dashboards: Visualizing Your Data Using Real-World Business Scenarios',
    'Effective Data Storytelling: How to Drive Change with Data, Narrative and Visuals','Information Dashboard Design: Displaying Data for At-a-Glance Monitoring','Show Me the Numbers: Designing Tables and Graphs to Enlighten','How to Measure Anything: Finding the Value of Intangibles in Business',
    'How to Measure Anything Workbook: Finding the Value of Intangibles in Business','Payments Systems in the U.S. - Third Edition: A Guide for the Payments Professional','Global Payments: And the Fintech Innovations Changing the Industry','Bank 4.0: Banking Everywhere, Never at a Bank',
    'Embedded Finance: When Payments Become An Experience','Automate Your Busywork: Do Less, Achieve More, and Save Your Brain for the Big Stuff','DeFi and the Future of Finance','Token Economy: How the Web3 reinvents the Internet','The Principles of Banking (Wiley Finance)',
    'Asset-Liability and Liquidity Management','Interest Rate Risk in the Banking Book: A Best Practice Guide to Management and Hedging','Bank Asset and Liability Management: Strategy, Trading, Analysis','Bank Regulation, Risk Management, and Compliance (Practical Finance and Banking Guides)',
    'Structured Finance: Leveraged Buyouts, Project Finance, Asset Finance and Securitization','The Mechanics of Securitization','Introduction to Structured Finance','The Handbook of Fixed Income Securities','Managing Investment Portfolios: A Dynamic Process',
    'Commercial Real Estate Analysis and Investments','Business Ethics','Managing Investment Portfolios: A Dynamic Process, Workbook','Handbook of Alternative Assets','Advanced Credit Risk Analysis and Management','Blockchain for Business','Algorithms to Live By - The Computer Science of Human Decisions',
    'The Lord Of The Rings','Wuthering Heights','Frankenstein','Adventures of Huckleberry Finn','Don Quixote','Invisible Man','The Last Leaf','Start Without Me: (I\'ll Be There in a Minute)', 'Tôi thấy hoa vàng trên cỏ xanh','Cho tôi xin một vé đi tuổi thơ',
    'Dế Mèn phiêu lưu ký','Nỗi buồn chiến tranh','The Art of Spirited Away','King Arthur and His Knights of the Round Table','Rick Riordan Presents: Aru Shah and the End of Time-A Pandava','Dragon Pearl','Rick Riordan Presents: The Last Fallen Star-A Gifted Clans Novel',
    'Freak Of Horror','The Horror Within'];

    const publisherNames = [
        'Penguin Random House','HarperCollins','Simon & Schuster','Macmillan Publishers','Hachette Livre','Oxford University Press','Random House','Vintage Books','Scholastic Corporation','Pearson Education','Bloomsbury Publishing','Wiley','Pan Macmillan',
        'Harvard University Press','Cambridge University Press','McGraw Hill','Wiley','Routledge','Churchill Livingstone','Analytics Press','Glenbrook Partners','BlockchainHub Berlin','Informa Law','Pearson', 'HarperCollins Publishers','AB Books','ShadowPOET',
        'Vertical Comics','VIZ Media LLC','Puffin Books','Rick Riordan Presents','Disney Hyperion','Rick Riordan Presents','Independently published','Marysue Rucci Books','Random House Worlds','Scholastic Press','DC Comics','Image Comics','Random House Worlds','Ize Press'];

    let customerData = [];

    for (let i = 0; i < 30; i++) {
        const customer = {
            customer_username: faker.internet.userName(),
            customer_password: faker.internet.password(),
            customer_fname: faker.name.firstName(),
            customer_lname: faker.name.lastName(),
            customer_avatar: '/img/User/Avatar.png',
            customer_email: faker.internet.email(),
            customer_address: faker.address.streetAddress(),
            customer_phoneNo: faker.phone.phoneNumber(),
            customer_role: faker.random.arrayElement(['admin', 'user', 'guest', 'supplier']),
        };

        customer._id = new mongoose.Types.ObjectId(); // Assign a new ObjectId to _id property
        customerData.push(customer);
    }

    // Function to generate reviews
    const generateReviews = (customerIds, bookId) => {
        const reviews = [];
        const numReviews = faker.datatype.number({min: 2, max: 5}); // Generate 2 to 5 reviews per book


        for (let i = 0; i < numReviews; i++) {
            const review = {
                customer: faker.random.arrayElement(customerIds),
                book: bookId,
                rating: faker.datatype.number({ min: 1, max: 5 }),
                comment: faker.lorem.paragraph(),
            };
            reviews.push(review);
        }

        return reviews;
    };

    // Generate dummy data for the Genre model
    const generateGenreData = () => {
        const genreData = {
            genre_name: faker.random.arrayElement(genreNames),
        };
        return genreData;
    };

    // Generate dummy data for the Author model
    const generateAuthorData = () => {
        const authorData = {
            author_name: faker.random.arrayElement(authorNames),
            biography: faker.lorem.paragraphs(10),
            contact_information: faker.internet.email(),
        };
        return authorData;
    };

    // Generate dummy data for the Publisher model
    const generatePublisherData = () => {
        const publisherData = {
            publisher_name: faker.random.arrayElement(publisherNames),
            publisher_location: faker.address.country(),
            contact_information: faker.internet.email(),
        };
        return publisherData;
    };

    // Generate and save dummy data for genres, authors, and publishers
    const genrePromises = Array.from({ length: 300 }, () => {
        const genreData = generateGenreData();
        return Genre.create(genreData);
    });

    const genres = await Promise.all(genrePromises);

    const authorPromises = Array.from({ length: 500 }, () => {
        const authorData = generateAuthorData();
        return Author.create(authorData);
    });

    const authors = await Promise.all(authorPromises);

    const publisherPromises = Array.from({ length: 100 }, () => {
        const publisherData = generatePublisherData();
        return Publisher.create(publisherData);
    });

    const publishers = await Promise.all(publisherPromises);

    // Generate dummy data for the Book model
    const generateBookData = (authors, genres, publishers) => {
        const bookData = {
            book_title: faker.random.arrayElement(bookTitles),
            publication_date: faker.date.past(),
            cover_image: generateCoverImagePath(),
            price: faker.datatype.number({ min: 10, max: 100 }),
            sale_price: faker.datatype.number({ min: 5, max: 50 }),
            inventory_count: faker.datatype.number({ min: 1, max: 100 }),
            sale_count: faker.datatype.number({ min: 0, max: 200 }),
            description: faker.lorem.paragraphs(5),
            authors: authors.map((author) => author._id),
            genres: genres.map((genre) => genre._id),
            publishers: publishers.map((publisher) => publisher._id),
        };
        return bookData;
    };

    const generateCoverImagePath = () => {
        const imageDirectory = path.join(__dirname, '../../public/img/Book-Cover/For-Sale');
        const fileNames = fs.readdirSync(imageDirectory);
        const randomFileName = faker.random.arrayElement(fileNames);
        const fileExtension = path.extname(randomFileName);
        const relativeImagePath = '/img/Book-Cover/For-Sale/' + randomFileName;

        return relativeImagePath;
    };

    // Generate dummy data for the BookGenre model
    const generateBookGenreData = (bookId, genreId) => {
        const bookGenreData = {
            book: bookId,
            genre: genreId,
        };
        return bookGenreData;
    };

    // Generate dummy data for the BookAuthor model
    const generateBookAuthorData = (bookId, authorId) => {
        const bookAuthorData = {
            book: bookId,
            author: authorId,
        };
        return bookAuthorData;
    };

    // Generate dummy data for the BookPublisher model
    const generateBookPublisherData = (bookId, publisherId) => {
        const bookPublisherData = {
            book: bookId,
            publisher: publisherId,
        };
        return bookPublisherData;
    };


    // Generate and save dummy data for books, genres, authors, and publishers
    try {
        // Generate books
        const bookPromises = Array.from({ length: 200 }, async () => {
            const bookData = generateBookData(authors, genres, publishers);
            const book = await Book.create(bookData);

            // Generate book-author associations
            const bookAuthorData = generateBookAuthorData(book._id, faker.random.arrayElement(authors)._id);
            await BookAuthor.create(bookAuthorData);

            // Generate book-genre associations
            const bookGenreData = generateBookGenreData(book._id, faker.random.arrayElement(genres)._id);
            await BookGenre.create(bookGenreData);

            // Generate book-publisher associations
            const bookPublisherData = generateBookPublisherData(book._id, faker.random.arrayElement(publishers)._id);
            await BookPublisher.create(bookPublisherData);

            // Generate reviews for the book
            const customerIds = customerData.map((customer) => customer._id);
            const reviews = generateReviews(customerIds, book._id);
            await Review.insertMany(reviews);

            return book;
        });

        const books = await Promise.all(bookPromises);

        // Generate book-genre associations
        const bookGenrePromises = books.map((book) => {
            const genreId = faker.random.arrayElement(genres)._id;
            const bookGenreData = generateBookGenreData(book._id, genreId);
            return BookGenre.create(bookGenreData);
        });
        await Promise.all(bookGenrePromises);

        // Generate book-author associations
        const bookAuthorPromises = books.map((book) => {
            const authorId = faker.random.arrayElement(authors)._id;
            const bookAuthorData = generateBookAuthorData(book._id, authorId);
            return BookAuthor.create(bookAuthorData);
        });
        await Promise.all(bookAuthorPromises);

        // Generate book-publisher associations
        const bookPublisherPromises = books.map((book) => {
            const publisherId = faker.random.arrayElement(publishers)._id;
            const bookPublisherData = generateBookPublisherData(book._id, publisherId);
            return BookPublisher.create(bookPublisherData);
        });
        await Promise.all(bookPublisherPromises);

        await Customer.insertMany(customerData);

        console.log('Dummy data generated successfully.');
    } catch (error) {
        console.error('Error generating dummy data:', error);
    }

};

module.exports = generateDummyData;
