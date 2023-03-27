const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  if (req.headers['current-user']) {
    res.locals.currentUser = JSON.parse(req.headers['current-user']);
  } else if (req.headers?.authorization?.includes('Bearer')) {
    res.locals.currentUser = jwt.decode(req.headers?.authorization?.split('Bearer ')?.[1] || '');
  }
  next();
};
