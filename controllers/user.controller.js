const jwt = require('jsonwebtoken');
const asyncCatcher = require('../utils/asyncCatcher');
const CustomeError = require('../utils/CustomError');
const User = require('../model/User');
const { UNAUTHORIZED_ACCESS } = require('../constants/errorConstants');

const sendServerToken = asyncCatcher(async (req, res, next) => {
  if (req.userData.email_verified === false) {
    return next(new CustomeError(UNAUTHORIZED_ACCESS));
  }

  let user;

  if (!req.userData.id) {
    const existUser = await User.findOne({
      email: req.userData.email,
    });

    if (!existUser) {
      user = await new User({
        username: req.userData.name,
        email: req.userData.email,
      }).save();
    } else {
      user = existUser;
    }
  } else {
    user = await User.findById(req.userData.id);
  }

  const serverToken = await jwt.sign(
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

  res.cookie('server_token', serverToken);

  res.json({
    ok: true,
    status: 200,
  });
});

module.exports = {
  sendServerToken,
};
