const validator = require('express-validator');
const jwt = require('jsonwebtoken');
const asyncCatcher = require('../utils/asyncCatcher');
const CustomeError = require('../utils/CustomError');
const {
  UNAUTHORIZED_ACCESS,
  INVALID_EMAIL,
  INVALID_TOKEN,
} = require('../constants/errorConstants');

const { getTargetUser, createServerToken } = require('../services/userService');

const sendServerToken = asyncCatcher(async (req, res, next) => {
  const { userData } = req;

  if (!userData.email_verified) {
    return next(new CustomeError(UNAUTHORIZED_ACCESS));
  }

  validator.check('userData.email', INVALID_EMAIL).isEmail().normalizeEmail();

  const user = await getTargetUser(userData);
  const serverToken = await createServerToken(user.id);

  res.cookie('server_token', serverToken);

  res.json({
    ok: true,
    status: 200,
    userInfo: user,
  });
});

const sendLoggedInUserInfo = asyncCatcher(async (req, res, next) => {
  const userIdToken = req.cookies['server_token'];
  const userId = jwt.verify(userIdToken, process.env.TOKEN_SECRET);

  const user = await getTargetUser({ id: userId });

  res.json({
    ok: true,
    status: 200,
    userInfo: user,
  });
});

module.exports = {
  sendServerToken,
  sendLoggedInUserInfo,
};
