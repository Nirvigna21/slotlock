require('dotenv').config();
const mongoose = require('mongoose');

console.log('Attempting to connect...');

mongoose.connect(process.env.MONGO_URI, { family: 4 })
  .then(() => {
    console.log('SUCCESS: Connected to MongoDB');
    process.exit(0);
  })
  .catch((err) => {
    console.log('FULL ERROR:', err);
    process.exit(1);
  });