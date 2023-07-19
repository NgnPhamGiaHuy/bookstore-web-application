const path = require('path');
const route = require('./routes');
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const database = require('./config/database')

const app = express();

// Set up the view engine
app.use(express.static(path.join(__dirname, 'public')));

app.set('views', path.join(__dirname, 'resources/views'));
app.set('view engine', 'ejs');

// Use body-parser middleware to parse request bodies
app.use(bodyParser.urlencoded({ extended: false }));

// Configure session middleware
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true
}));

// Call the route function passing the app object as a parameter
route(app);

// Connect to MongoDB
database.connect()

app.listen(3000, () => {
  console.log('Server started on port 3000');
});
