const indexRouter = require('../routes/index');
const usersRouter = require('../routes/users');
const buildingsRouter = require('../routes/buildings');

function routerLoader({ app }) {
  app.use('/', indexRouter);
  app.use('/api/users', usersRouter);
  app.use('/api/buildings', buildingsRouter);
}

module.exports = routerLoader;
