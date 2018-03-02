'use strict';

const express = require('express');
const logger = require('../../infrastructure/logger');
const { asyncWrapper } = require('login.dfe.express-error-handling');

const getIndex = require('./terms');

const router = express.Router({ mergeParams: true });

const terms = () => {
  logger.info('Mounting terms route');

  router.get('/', asyncWrapper(getIndex));

  return router;
};

module.exports = terms;
