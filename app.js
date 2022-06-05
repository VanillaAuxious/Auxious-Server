require('dotenv').config();
const express = require('express');
const loaders = require('./loader/index');
const app = express();
const run = require('./services/crawlingService');

(async function () {
  run();
  await loaders({ expressApp: app });
})();

module.exports = app;
