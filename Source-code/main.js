const path = require('path');
const route = require('./routes');
const express = require('express');

const app = express();

// Set up the view engine
app.use(express.static(path.join(__dirname, 'public')));

app.set('views', path.join(__dirname, 'resources/views'));
app.set('view engine', 'ejs');

// Call the route function passing the app object as a parameter
route(app);

app.listen(3000, () => {
  console.log('Server started on port 3000');
});
