const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: 1,
  },
  description: {
    type: String,
    default: '',
  },
  favoriteBuildings: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Building',
  },
  favoriteRegions: {
    type: [String],
    default: [],
  },
});

module.exports = mongoose.model('User', userSchema);
