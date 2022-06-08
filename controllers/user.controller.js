const asyncCatcher = require('../utils/asyncCatcher');
const CustomeError = require('../utils/CustomError');
const User = require('../model/User');

const {
  USER_DOES_NOT_EXIST,
  BUILDING_DOES_NOT_EXIST,
} = require('../constants/errorConstants');

const {
  getTargetUser,
  createServerToken,
  getFieldById,
} = require('../services/userService');

const getServerToken = asyncCatcher(async (req, res, next) => {
  const { userData } = req;

  const user = await getTargetUser(userData);
  const serverToken = createServerToken(user.id);

  res.cookie('server_token', serverToken);

  res.json({
    ok: true,
    status: 200,
    userInfo: user,
  });
});

const getLoggedInUserInfo = asyncCatcher(async (req, res, next) => {
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
  const { userId } = req;
  const favoriteBuildings = await getFieldById(
    User,
    userId,
    'favoriteBuildings',
  );

  if (!favoriteBuildings) {
    next(new CustomeError(BUILDING_DOES_NOT_EXIST));
  }

  res.json({
    ok: true,
    status: 200,
    favoriteBuildings,
  });
});

const getFavoriteRegions = asyncCatcher(async (req, res, next) => {
  const { userId } = req;
  const favoriteRegions = await getFieldById(User, userId, 'favoriteRegions');

  res.json({
    ok: true,
    status: 200,
    favoriteRegions,
  });
});

const postFavoriteBuilding = asyncCatcher(async (req, res, next) => {
  const { userId } = req;
  const { buildingId } = req.body;

  await User.findByIdAndUpdate(userId, {
    $addToSet: {
      favoriteBuildings: buildingId,
    },
  });

  res.json({
    ok: true,
    status: 201,
  });
});

const postFavoriteRegion = asyncCatcher(async (req, res, next) => {
  const { userId } = req;
  const { region } = req.body;

  await User.findByIdAndUpdate(userId, {
    $addToSet: {
      favoriteRegions: region,
    },
  });

  res.json({
    ok: true,
    status: 201,
  });
});

const deleteFavoriteBuilding = asyncCatcher(async (req, res, next) => {
  const { buildingId } = req.params;
  const { userId } = req;

  await User.findByIdAndUpdate(userId, {
    $pull: {
      favoriteBuildings: buildingId,
    },
  });

  res.json({
    ok: true,
    status: 200,
  });
});

const deleteFavoriteRegion = asyncCatcher(async (req, res, next) => {
  const { regionName } = req.params;
  const { userId } = req;

  console.log(regionName);

  await User.findByIdAndUpdate(userId, {
    $pull: {
      favoriteRegions: regionName,
    },
  });

  res.json({
    ok: true,
    status: 200,
  });
});

module.exports = {
  getServerToken,
  getLoggedInUserInfo,
  getFavoriteBuildings,
  getFavoriteRegions,
  postFavoriteBuilding,
  postFavoriteRegion,
  deleteFavoriteBuilding,
  deleteFavoriteRegion,
};
