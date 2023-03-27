require('express-async-errors');
const error = require('../middlewares/error');
const requestNotFound = require('../middlewares/requestNotFound');
const { logTrace } = require('../libraries/utils/logger');

module.exports = (app) => {

  app.use(requestNotFound);
  app.use(error);
};
