const express = require('express');
const router = express.Router();

const {
  getBuildingInfo,
  getBuildingsOnMap,
  getAuctions
} = require('../controllers/building.controller');
const { isLoggedIn } = require('../middlewares/auth');

router.get('/', isLoggedIn, getBuildingsOnMap);
router.get('/auctions', isLoggedIn, getAuctions);
router.get('/:buildingId', isLoggedIn, getBuildingInfo);

module.exports = router;
