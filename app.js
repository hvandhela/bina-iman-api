const express = require('express');
const { logFatal } = require('./libraries/utils/logger');

const app = express();

require('dotenv').config();
require('./startup/initialize')(app);
require('./startup/routes')(app);
require('./startup/db')();


process.on('uncaughtException', (err) => {
  logFatal(err);
});

process.on('unhandledRejection', (err) => {
  logFatal(err);
});

module.exports = app;
