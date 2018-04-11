'use strict';

const express = require('express');
const { isLoggedIn } = require('../../infrastructure/utils');
const logger = require('../../infrastructure/logger');
const { asyncWrapper } = require('login.dfe.express-error-handling');

const get = require('./get');
const post = require('./post');

const router = express.Router({ mergeParams: true });

const area = (csrf) => {
  logger.info('Mounting change details routes');

  router.use(isLoggedIn);

  router.get('/', csrf, asyncWrapper(get));
  router.post('/', csrf, asyncWrapper(post));

  return router;
};

module.exports = area;
