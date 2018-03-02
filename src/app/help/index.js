'use strict';

const express = require('express');
const logger = require('../../infrastructure/logger');
const { asyncWrapper } = require('login.dfe.express-error-handling');

const getIndex = require('./help');

const router = express.Router({ mergeParams: true });

const help = () => {
  logger.info('Mounting help routes');

  router.use('/', asyncWrapper(getIndex));

  return router;
};

module.exports = help;
