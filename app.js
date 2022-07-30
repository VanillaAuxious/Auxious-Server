require('dotenv').config();
const express = require('express');
const loaders = require('./loader/index');
const app = express();
const runAuctionCrawling = require('./services/crawlingService');

(async function () {
  // await runAuctionCrawling();
  await loaders({ expressApp: app });
})();

module.exports = app;
