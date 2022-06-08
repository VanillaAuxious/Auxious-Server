const express = require('express');

const { verifyToken, isLoggedIn } = require('../middlewares/auth');

const {
  getServerToken,
  getLoggedInUserInfo,
  getFavoriteBuildings,
  getFavoriteRegions,
  postFavoriteBuilding,
  postFavoriteRegion,
  deleteFavoriteBuilding,
  deleteFavoriteRegion,
} = require('../controllers/user.controller');

const router = express.Router();

router.post('/login', verifyToken, getServerToken);
router.get('/user', isLoggedIn, getLoggedInUserInfo);
router
  .route('/user/favorites/buildings')
  .get(isLoggedIn, getFavoriteBuildings)
  .post(isLoggedIn, postFavoriteBuilding);

router
  .route('/user/favorites/regions')
  .get(isLoggedIn, getFavoriteRegions)
  .post(isLoggedIn, postFavoriteRegion);

router.delete(
  '/user/favorites/buildings/:buildingId',
  isLoggedIn,
  deleteFavoriteBuilding,
);

router.delete(
  '/user/favorites/regions/:regionName',
  isLoggedIn,
  deleteFavoriteRegion,
);

module.exports = router;
