const indexRouter = require('../routes/index');
const usersRouter = require('../routes/users');
const buildingsRouter = require('../routes/buildings');
const crawlingRouter = require('../routes/crawling');

function routerLoader({ app }) {
  app.use('/', indexRouter);
  app.use('/api/users', usersRouter);
  app.use('/api/buildings', buildingsRouter);
  app.use('/api/crawling', crawlingRouter);
}

module.exports = routerLoader;
