const expressLoader = require('./express');
require('../config/db');

async function loaders({ expressApp }) {
  await expressLoader({ app: expressApp });
}

module.exports = loaders;
