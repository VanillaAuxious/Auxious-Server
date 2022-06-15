require('dotenv').config();
const express = require('express');
const loaders = require('./loader/index');
const messaging = require('./config/firebaseInit');
const app = express();

(async function () {
  await loaders({ expressApp: app });
})();

module.exports = app;
