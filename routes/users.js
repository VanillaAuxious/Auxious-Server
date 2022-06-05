const express = require('express');

const { verifyToken } = require('../middlewares/auth');
const { sendServerToken } = require('../controllers/user.controller');

const router = express.Router();

/* GET users listing. */
router.post('/login', verifyToken, sendServerToken);

module.exports = router;
