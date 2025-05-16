# 🏆 Bookstore Web Application

[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![EJS](https://img.shields.io/badge/EJS-B4CA65?style=for-the-badge&logo=ejs&logoColor=white)](https://ejs.co/)

## 📝 Description

Bookstore Web Application is a comprehensive e-commerce platform designed for book lovers. This web application allows users to browse, search, and purchase books online with a seamless user experience. The platform features intuitive navigation, detailed book information, user authentication, and secure checkout processes.

Built with Node.js, Express, and MongoDB, this application demonstrates best practices in web development with a focus on performance, scalability, and security.

## ✨ Features

- **User authentication** - Register, login, and account verification via email
- **Book browsing** - Search books by title, author, genre, or keywords
- **Detailed book pages** - View comprehensive information about books including descriptions and reviews
- **Shopping cart** - Add books, manage quantities, and remove items seamlessly
- **Order processing** - Secure checkout with multiple payment options
- **User profiles** - Manage personal information and view order history
- **Responsive design** - Optimized for desktop and mobile devices
- **Admin dashboard** - Manage books, authors, and user accounts (for administrators)

## 🖼️ Demo / Screenshots

![Login Page](https://github.com/HinhNhuLaHuy/Online-Bookstore-Project/assets/84061230/68d2e8c1-a7eb-47ea-9efd-c013c62f266c)

![Home Page](https://github.com/HinhNhuLaHuy/Online-Bookstore-Project/assets/84061230/c06a47aa-c5a0-4024-9bc2-100cdb06e5cd)

![Shop Page](https://github.com/HinhNhuLaHuy/Online-Bookstore-Project/assets/84061230/2f0f2781-66b5-417f-ab49-9bbbf777cc28)

## ⚙️ Installation

### Prerequisites

- Node.js (v14+)
- MongoDB
- npm or yarn

### Setup Instructions

```bash
# Clone the repository
git clone https://github.com/ngnphamgiahuy/bookstore-web-application.git
cd bookstore-web-application

# Install dependencies
cd src
npm install

# Set up environment variables
cp .env.example .env
# Edit .env file with your MongoDB URI and other configuration

# Start the development server
npm start
```

## 🚀 Usage

After starting the server, access the application at:

```
http://localhost:3000
```

### User Accounts

- To access all features, register for a new account
- Verify your email via the verification link sent to your inbox
- Login with your credentials to start shopping

### Admin Access

```
URL: http://localhost:3000/admin
Username: admin@bookstore.com
Password: admin123
```

## 🔧 Configuration

Create a `.env` file in the src directory with the following variables:

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/bookstore
SESSION_SECRET=your-session-secret
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-email-password
```

## 🗂️ Folder Structure

```
├── src/                  # Source code
│   ├── app/              # Application components
│   │   ├── controllers/  # Request handlers
│   │   ├── models/       # Database models
│   │   └── utils/        # Utility functions
│   ├── config/           # Configuration files
│   ├── public/           # Static assets (CSS, JS, images)
│   ├── resources/        # View templates
│   │   └── views/        # EJS templates
│   ├── routes/           # Route definitions
│   ├── main.js           # Application entry point
│   └── package.json      # Dependencies
├── doc/                  # Documentation
└── README.md             # Project documentation
```

## 🤝 Contributing

Contributions are welcome! Follow these steps to contribute:

```bash
# Fork the repository
# Clone your fork
git clone https://github.com/ngnphamgiahuy/bookstore-web-application.git

# Create a feature branch
git checkout -b feature/amazing-feature

# Commit your changes
git commit -m "Add amazing feature"

# Push to the branch
git push origin feature/amazing-feature

# Open a Pull Request
```

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.

## 👤 Author

**Nguyen Pham Gia Huy**

[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/NgnPhamGiaHuy)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://linkedin.com/in/nguyenphamgiahuy)

## 🙏 Acknowledgements

- [Express.js](https://expressjs.com/) - Web framework
- [MongoDB](https://www.mongodb.com/) - Database
- [EJS](https://ejs.co/) - Templating engine
- [Bcrypt](https://www.npmjs.com/package/bcrypt) - Password hashing
- [Nodemailer](https://nodemailer.com/) - Email functionality
- All contributors who have helped shape this project
