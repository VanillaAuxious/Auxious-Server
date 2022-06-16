const { sendNotificationToClient } = require('../config/notify');

const User = require('../model/User');
const asyncCatcher = require('../utils/asyncCatcher');

const sendFavoriteRegionNoti = asyncCatcher(async (req, res, next) => {
  const { region, auctionNumber, buildingId } = req.body;

  const loggedInTargetUser = await User.find()
    .where('favoriteRegions')
    .in([`${region}`])
    .where('currentDeviceToken')
    .ne('');

  const tokens = loggedInTargetUser.map((user) => user.currentDeviceToken);
  const notificationData = {
    title: `New Auction in ${region}`,
    body: `Number : ${auctionNumber}`,
    buildingId,
  };

  sendNotificationToClient(tokens, notificationData);

  res.json({
    ok: true,
    status: 200,
  });
});

module.exports = {
  sendFavoriteRegionNoti,
};
