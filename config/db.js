require('dotenv').config();
const mongoose = require('mongoose');

mongoose.connection.once('open', () => console.log('db connected'));
mongoose.connection.on('error', (error) => console.log(error));

async function connectDB() {
  await mongoose.connect(process.env.MONGODB_URL);
}

async function disconnectDB() {
  await mongoose.disconnect();
}

module.exports = {
  connectDB,
  disconnectDB,
};
