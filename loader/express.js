const createError = require('http-errors');
const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const routerLoader = require('./router');
const errorHandler = require('../middlewares/errorHandler');
const cors = require('cors');
const { connectDB } = require('../config/db');

async function expressLoader({ app }) {
  connectDB();

  app.use(cors());
  app.use(logger('dev'));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());

  await routerLoader({ app });

  // catch 404 and forward to error handler
  app.use(function (req, res, next) {
    next(createError(404));
  });

  // error handler
  app.use(errorHandler);
}

module.exports = expressLoader;
