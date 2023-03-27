const winston = require('winston');
const config = require('config');
const moment = require('moment');
const { mkdirSync, existsSync } = require('fs');
require('winston-logstash');
const pjson = require('../../package.json');

const appName = config.get('app.name');

const customLevel = {
  levels: {
    fatal: 0,
    error: 1,
    info: 2,
    trace: 3,
    debug: 4,
  },
  colors: {
    fatal: 'red',
    error: 'red',
    info: 'yellow',
    trace: 'blue',
    debug: 'green',
  },
};

if (!existsSync('log')) {
  mkdirSync('log');
}
winston.addColors(customLevel.colors);

const fileTransport = new winston.transports.File({
  filename: `log/${appName.replace(/ /g, '').toLowerCase()}-${moment().format('YYYY-MM-DD')}.log`,
});

const transports = [];

transports.push(fileTransport);

  const logstashTransport = new winston.transports.Logstash({
    level: 'info',
    port: config.get('logstash.port'),
    host: config.get('logstash.host'),
    max_connect_retries: -1,
  }).on('error', () => {
    // console.log(e);
  });

  transports.push(logstashTransport);

const logger = new winston.Logger({
  exitOnError: false,
  transports,
});


const logError = (err, httpCode, req = { get: () => {} }, res = { locals: { currentUser: {} } }) => {
  const { currentUser } = res.locals;
  const body = { ...req.body };
  delete body.password;
  logger.error(err.message, {
    service: pjson.name,
    userId: currentUser ? currentUser.userId : null,
    nik: currentUser ? currentUser.nik : null,
    fullname: currentUser ? currentUser.fullname : null,
    httpCode,
    stack: err.stack,
    name: err.name,
    endpoint: req.originalUrl,
    ip: (req.headers['x-forwarded-for'] || '').split(',')[0] || req.socket.remoteAddress,
    device: req.device ? req.device.type : null,
    userAgent: req.get ? req.get('User-Agent') : null,
    reqBody: JSON.stringify(body),
    reqHeaders: JSON.stringify(req.headers),
  });
};

const logTrace = (req = { get: () => {} }, res = { locals: { currentUser: {} } }, next = () => {}) => {
  const { currentUser } = res.locals;
  const body = { ...req.body };
  delete body.password;
  logger.info('info', {
    service: pjson.name,
    userId: currentUser ? currentUser.userId : null,
    nik: currentUser ? currentUser.nik : null,
    fullname: currentUser ? currentUser.fullname : null,
    endpoint: req.originalUrl,
    ip: (req.headers['x-forwarded-for'] || '').split(',')[0] || req.socket.remoteAddress,
    device: req.device ? req.device.type : null,
    userAgent: req.get ? req.get('User-Agent') : null,
    reqBody: JSON.stringify(body),
    reqHeaders: JSON.stringify(req.headers),
  });
  return next();
};

const logFatal = (err) => {
  logger.fatal(err.message, {
    stack: err.stack,
    name: err.name,
  });
};

module.exports = {
  logger,
  logError,
  logTrace,
  logFatal,
};
