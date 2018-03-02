'use strict';

const express = require('express');
const { isLoggedIn } = require('../../infrastructure/utils');
const logger = require('../../infrastructure/logger');
const { asyncWrapper } = require('login.dfe.express-error-handling');

const getIndex = require('./profile');

const router = express.Router({ mergeParams: true });

const home = () => {
  logger.info('Mounting home routes');

  router.get('/', isLoggedIn, asyncWrapper(getIndex));

  return router;
};

module.exports = home;
