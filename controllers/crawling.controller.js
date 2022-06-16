const User = require('../model/User');
const asyncCatcher = require('../utils/asyncCatcher');

const { sendNotificationToClient } = require('../config/notify');

const sendFavoriteRegionNoti = asyncCatcher(async (req, res, next) => {
  const { region, auctionNumber } = req.body

  const loggedInTargetUsers = await User.find().where('favoriteRegions').in([`${region}`]).where('currentDeviceToken').ne('');
  const tokens = loggedInTargetUsers.map((user) => user.currentDeviceToken);

  const notificationData = {
    title: `New Auction in ${region}`,
    body: `Number: ${auctionNumber}`,
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
