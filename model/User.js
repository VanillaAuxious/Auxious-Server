const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  profileImage: {
    type: String,
    default: null,
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
  },
  favoriteRegions: {
    type: [String],
  },
  currentDeviceToken: {
    type: String,
    default: '',
  },
  contract: {
    type: [String],
  },
});

module.exports = mongoose.model('User', userSchema);
