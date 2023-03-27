const { logError } = require('../libraries/utils/logger');
const respond = require('../libraries/utils/respond');
const { convert } = require('../libraries/utils/validationError');

module.exports = function (err, req, res) {
  switch (err.name) {
    case 'ValidationError':
      logError(err, 400, req, res);
      return respond.resValidationError(res, 'ValidationError', convert(err));
    case 'Invalid Request':
      logError(err, 400, req, res);
      return respond.resBadRequest(res, err.name, err.details);
    case 'TokenExpiredError':
      logError(err, 400, req, res);
      return respond.resBadRequest(res, 'TokenExpiredError', 'Token Expired');
    case 'NotFoundError':
      logError(err, 400, req, res);
      return respond.resBadRequest(res, err.message);
    case 'AuthenticationError':
      logError(err, 401, req, res);
      return respond.resUnauthorized(res, err.message);
    default:
      logError(err, 400, req, res);
      return respond.resBadRequest(res, err.message, err);
  }
};
