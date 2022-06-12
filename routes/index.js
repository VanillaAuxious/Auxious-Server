const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.json({
    ok: true,
    status: 200,
    message: 'this is server',
    cliEnvIsWorking: !!process.env.ENV,
  });
});

module.exports = router;
