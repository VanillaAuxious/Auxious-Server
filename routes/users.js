const express = require('express');
const multer = require('multer');

const { verifyToken, isLoggedIn } = require('../middlewares/auth');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads');
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now());
  },
});

const upload = multer({ storage: storage });

const {
  getServerToken,
  getLoggedInUserInfo,
  getFavoriteBuildings,
  getFavoriteRegions,
  postFavoriteBuilding,
  postFavoriteRegion,
  deleteFavoriteBuilding,
  deleteFavoriteRegion,
  updateUserField,
  updateUserImage,
  updateUserContract,
  getUserContract,
  deleteDeviceToken,
} = require('../controllers/user.controller');

const router = express.Router();

router.post('/login', verifyToken, getServerToken);

router
  .route('/user')
  .get(isLoggedIn, getLoggedInUserInfo)
  .patch(isLoggedIn, updateUserField);

router
  .route('/user/image')
  .post(upload.single('img'), isLoggedIn, updateUserImage);

router
  .route('/user/contract')
  .post(isLoggedIn, updateUserContract)
  .get(isLoggedIn, getUserContract);

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

router.delete(
  '/user/device-token',
  isLoggedIn,
  deleteDeviceToken,
);

module.exports = router;
