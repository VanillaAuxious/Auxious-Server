const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');
const asyncCatcher = require('../utils/asyncCatcher');
const CustomeError = require('../utils/CustomError');

const {
  TOKEN_DOES_NOT_EXIST,
  INVALID_TOKEN,
} = require('../constants/errorConstants');

const verifyToken = asyncCatcher(async (req, res, next) => {
  const isLoggedInBefore = req.cookies['server_token'];

  if (isLoggedInBefore) {
    res.cookie('server_token', req.cookies['server_token']);

    return res.json({
      ok: true,
      status: 200,
    });
  }

  const clientId = req.body.clientId;
  const googleToken = req.body.token;

  if (!googleToken) {
    return next(new CustomeError(TOKEN_DOES_NOT_EXIST));
  }

  const client = new OAuth2Client(clientId);
  const [bearer, token] = googleToken.split(' ');

  if (bearer !== 'Bearer') {
    return next(new CustomeError(INVALID_TOKEN));
  }

  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: clientId,
  });

  const payload = ticket.getPayload();
  req.userData = payload;

  next();
});

const isLoggedIn = asyncCatcher(async () => {});

const isLoggedOut = asyncCatcher(async () => {});

module.exports = {
  verifyToken,
  isLoggedIn,
  isLoggedOut,
};
