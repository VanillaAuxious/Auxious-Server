const User = require('../model/User');
const jwt = require('jsonwebtoken');

async function getTargetUser(userData) {
  if (!userData.id) {
    const existUser = await User.findOne({
      email: userData.email,
    });

    if (!existUser) {
      return await new User({
        username: userData.name,
        email: userData.email,
      }).save();
    }

    return existUser;
  }

  return await User.findById(userData.id);
}

async function createServerToken(user) {
  return await jwt.sign(
    {
      id: user._id,
      username: user.username,
      email: user.email,
      description: user.description,
      favoriteBuildings: user.favoriteBuildings,
      favoriteRegion: user.favoriteRegion,
    },
    process.env.TOKEN_SECRET,
  );
}

module.exports = {
  getTargetUser,
  createServerToken,
};
