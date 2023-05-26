const mongoose = require('mongoose')

async function connect() {
  try {
    await mongoose.connect('mongodb+srv://yuh_nguyenpham:%40Number010@cluster0.ynhys8t.mongodb.net/Online-Bookstore', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Connect database successfully!!!')
  } catch (error) {
    console.log('Connect database failure!!!')
  }
}

module.exports = { connect };