const asyncCatcher = require('../utils/asyncCatcher');
const CustomeError = require('../utils/CustomError');

const { USER_DOES_NOT_EXIST } = require('../constants/errorConstants');
const {
  getTargetUser,
  createServerToken,
  getBuildingsById,
} = require('../services/userService');

const sendServerToken = asyncCatcher(async (req, res, next) => {
  const { userData } = req;

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
  const { userId } = req;
  const user = await getTargetUser({ id: userId });

  if (!user) {
    return next(new CustomeError(USER_DOES_NOT_EXIST));
  }

  res.json({
    ok: true,
    status: 200,
    userInfo: user,
  });
});

const getFavoriteBuildings = asyncCatcher(async (req, res, next) => {
  const { userId } = req.params;
  const buildings = await getBuildingsById(userId);

  if (!buildings) {
    return next(new CustomeError(USER_DOES_NOT_EXIST));
  }

  res.json({
    ok: true,
    status: 200,
    favoriteBuildings: buildings,
  });
});

module.exports = {
  sendServerToken,
  sendLoggedInUserInfo,
  getFavoriteBuildings,
};
