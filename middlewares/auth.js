const jwt = require('jsonwebtoken');
const asyncCatcher = require('../utils/asyncCatcher');
const CustomError = require('../utils/CustomError');

const { ACCESS_TOKEN_URL } = require('../constants/urlConstants');

const {
  TOKEN_DOES_NOT_EXIST,
  INVALID_TOKEN,
  NOT_LOGGED_IN,
} = require('../constants/errorConstants');
const { default: axios } = require('axios');

const verifyToken = asyncCatcher(async (req, res, next) => {
  const { code } = req.body;

  const accessToken = (
    await axios.post(`${ACCESS_TOKEN_URL}&code=${code}`)
  ).data
    .split('=')[1]
    .split('&')[0];

  if (!accessToken) {
    return next(new CustomError(INVALID_TOKEN));
  }

  const userData = (
    await axios.get('https://api.github.com/user', {
      headers: {
        Authorization: `token ${accessToken}`,
      },
    })
  ).data;

  const userInfo = {
    name: userData.login,
    email: userData.email ? userData.email : `${userData.login}@gmail.com`,
    profileImage: userData.avatar_url,
  };

  req.userData = userInfo;

  next();
});

const isLoggedIn = asyncCatcher(async (req, res, next) => {
  if (!req.cookies['server_token']) {
    return next(new Error(TOKEN_DOES_NOT_EXIST));
  }

  const userIdToken = req.cookies['server_token'];
  const userId = jwt.verify(userIdToken, process.env.TOKEN_SECRET);
  req.userId = userId;

  next();
});

const isLoggedOut = asyncCatcher(async (req, res, next) => {
  if (req.cookies['server_token']) {
    return next(new Error(NOT_LOGGED_IN));
  }

  next();
});

module.exports = {
  verifyToken,
  isLoggedIn,
  isLoggedOut,
};
