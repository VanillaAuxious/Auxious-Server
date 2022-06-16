const express = require('express');
const router = express.Router();

const { sendFavoriteRegionNoti } = require('../controllers/crawling.controller');

router.post('/push-noti', sendFavoriteRegionNoti);

module.exports = router;
