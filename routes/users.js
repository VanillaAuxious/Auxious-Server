const express = require('express');

const { verifyToken, isLoggedIn } = require('../middlewares/auth');

const {
  sendServerToken,
  sendLoggedInUserInfo,
} = require('../controllers/user.controller');

const router = express.Router();

/* GET users listing. */
router.post('/login', verifyToken, sendServerToken);
router.get('/user', isLoggedIn, sendLoggedInUserInfo);

module.exports = router;
