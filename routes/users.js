const express = require('express');

const { verifyToken, isLoggedIn } = require('../middlewares/auth');

const {
  sendServerToken,
  sendLoggedInUserInfo,
  getFavoriteBuildings,
} = require('../controllers/user.controller');

const router = express.Router();

router.post('/login', verifyToken, sendServerToken);
router.get('/user', isLoggedIn, sendLoggedInUserInfo);
router.get('/:userId/favorites/buildings', getFavoriteBuildings);

module.exports = router;
