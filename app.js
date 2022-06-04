const express = require('express');
const loaders = require('./loader/index');
const run = require('./services/crawlingService');
const app = express();

(async function () {
  await loaders({ expressApp: app });
  run();
})();

module.exports = app;
