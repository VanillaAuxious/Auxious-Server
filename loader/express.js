const createError = require('http-errors');
const express = require('express');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const logger = require('morgan');
const routerLoader = require('./router');
const errorHandler = require('../middlewares/errorHandler');
const cors = require('cors');
const { connectDB } = require('../config/db');

async function expressLoader({ app }) {
  connectDB();

  app.use(
    cors({
      origin: [
        process.env.ENV === 'dev' && 'http://localhost:3000',
        'https://teamproject-auxios.netlify.app',
        'https://teamproject-auxios-test.netlify.app',
      ],
      credentials: true,
    }),
  );

  app.use(logger('dev'));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());
  app.use(
    session({
      resave: false,
      saveUninitialized: false,
      secret: process.env.SESSION_SECRET,
      cookie: {
        sameSite: 'none',
        secure: true,
      },
    }),
  );

  routerLoader({ app });

  app.use((req, res, next) => {
    next(createError(404));
  });

  app.use(errorHandler);
}

module.exports = expressLoader;
