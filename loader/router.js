const indexRouter = require('../routes/index');
const usersRouter = require('../routes/users');

function routerLoader({ app }) {
  app.use('/api', indexRouter);
  app.use('/api/users', usersRouter);
}

module.exports = routerLoader;
