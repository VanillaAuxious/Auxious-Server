require('dotenv').config();
const express = require('express');
const loaders = require('./loader/index');
const app = express();
const run = require('./services/crawlingService');

(async function () {
  await loaders({ expressApp: app });
  // run();
})();

module.exports = app;
