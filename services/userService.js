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

module.exports = {
  getTargetUser,
  createServerToken,
};
