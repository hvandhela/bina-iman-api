const config = require('config');
const apm = require('elastic-apm-node');

module.exports = () => {
  // START APM
  if (config.get('apm.on') === 'true') {
    apm.start({
      serverUrl: config.get('apm.url'),
    });
  }
};
