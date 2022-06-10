const express = require('express');
const router = express.Router();

const {
  getBuildingInfo,
  getBuildingsOnMap,
} = require('../controllers/building.controller');
const { isLoggedIn } = require('../middlewares/auth');

router.get('/', getBuildingsOnMap);
router.get('/:buildingId', isLoggedIn, getBuildingInfo);

module.exports = router;
