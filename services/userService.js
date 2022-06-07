const User = require('../model/User');
const jwt = require('jsonwebtoken');

async function getTargetUser(userData) {
  let user;

  if (!userData.id) {
    const existUser = await User.findOne({
      email: userData.email,
    });

    if (!existUser) {
      user = await new User({
        username: userData.name,
        email: userData.email,
      }).save();
    } else {
      user = existUser;
    }
  } else {
    user = await User.findById(userData.id);
  }

  return {
    id: user._id,
    username: user.username,
    email: user.email,
    description: user.description,
    favoriteBuildings: user.favoriteBuildings,
    favoriteRegion: user.favoriteRegion,
  };
}

function createServerToken(id) {
  return jwt.sign(id.toHexString(), process.env.TOKEN_SECRET);
}

async function getUserFavoriteBuildings(userId) {
  if (userId) {
    const Buildings = await User.findById(userId).populate('buildings');

    if (!Buildings) {
      return [];
    }

    return Buildings;
  }

  return null;
}

module.exports = {
  getTargetUser,
  createServerToken,
  getUserFavoriteBuildings,
};
