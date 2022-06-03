const mongoose = require("mongoose");

mongoose.connection.once('open', () => console.log('db connected'));
mongoose.connection.on('error', (error) => console.log('error'));

function connectDB() {
  mongoose.connect("mongodb+srv://hkh0105:hanhk00700@unicorn.o28wi.mongodb.net/?retryWrites=true&w=majority");
}

function disconnectDB() {
  mongoose.disconnect()
}

module.exports = {
  connectDB,
  disconnectDB,
};
