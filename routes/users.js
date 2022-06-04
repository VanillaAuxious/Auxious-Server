const express = require('express');
const { verifyToken } = require('../middlewares/auth');

const router = express.Router();

/* GET users listing. */
router.post('/login', verifyToken, (req, res, next) => {
  res.json({
    ok: false,
  });
});

module.exports = router;
