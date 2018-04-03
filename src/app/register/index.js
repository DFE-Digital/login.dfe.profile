'use strict';

const express = require('express');
const logger = require('../../infrastructure/logger');
const { asyncWrapper } = require('login.dfe.express-error-handling');

const getDetails = require('./getDetails');
const postDetails = require('./postDetails');

const router = express.Router({ mergeParams: true });

const register = (csrf) => {
  logger.info('Mounting register routes');

  router.get('/', csrf, asyncWrapper(getDetails));
  router.post('/', csrf, asyncWrapper(postDetails));

  return router;
};

module.exports = register;
