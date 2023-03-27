const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const fileUpload = require('express-fileupload');
const device = require('express-device');
const currentUser = require('../middlewares/currentUser');

module.exports = (app) => {
  
  // secure various HTTP headers with helmet
  app.use(helmet());

  // parse json request body
  app.use(express.json({ limit: '50mb' }));

  // parse urlencoded request body
  app.use(express.urlencoded({ extended: true, limit: '100mb' }));

  // enable request file upload
  app.use(fileUpload());

  // enable cors
  app.use(cors());

  // parse current user
  app.use(currentUser);

  app.use(device.capture());
};
