const validator = require('express-validator');
const asyncCatcher = require('../utils/asyncCatcher');
const CustomeError = require('../utils/CustomError');
const {
  UNAUTHORIZED_ACCESS,
  INVALID_EMAIL,
} = require('../constants/errorConstants');

const { getTargetUser, createServerToken } = require('../services/userService');

const sendServerToken = asyncCatcher(async (req, res, next) => {
  const { userData } = req;

  if (!userData.email_verified) {
    return next(new CustomeError(UNAUTHORIZED_ACCESS));
  }

  const user = await getTargetUser(userData);
  const serverToken = await createServerToken(user);

  res.cookie('server_token', serverToken);

  res.json({
    ok: true,
    status: 200,
  });
});

module.exports = {
  sendServerToken,
};
