const respond = require('../libraries/utils/respond');

module.exports = (req, res) => respond.resBadRequest(res, 'Request Not Found');
