const asyncCatcher = require('../utils/asyncCatcher');
const CustomeError = require('../utils/CustomError');
const jwt = require('jsonwebtoken');

const {
  TOKEN_DOES_NOT_EXIST,
  INVALID_TOKEN,
  UNAUTHORIZED_ACCESS,
  TOKEN_EXPIRED,
} = require('../constants/errorConstants');

const verifyToken = asyncCatcher(async (req, res, next) => {
  const googleToken = req.body.token;

  if (!googleToken) {
    return next(new CustomeError(TOKEN_DOES_NOT_EXIST));
  }

  const [bearer, token] = googleToken.split(' ');

  if (bearer !== 'Bearer') {
    return next(new CustomeError(INVALID_TOKEN));
  }

  const decode = jwt.verify(token, process.env.GOOGLE_TOKEN_SECRET, {
    algorithm: 'RS256',
  });
  console.log(decode);
  next();
});

const isLoggedIn = asyncCatcher(async () => {});

const isLoggedOut = asyncCatcher(async () => {});

module.exports = {
  verifyToken,
  isLoggedIn,
  isLoggedOut,
};
