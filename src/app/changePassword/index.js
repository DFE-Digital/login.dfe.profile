'use strict';

const express = require('express');
const { isLoggedIn } = require('../../infrastructure/utils');
const logger = require('../../infrastructure/logger');

const router = express.Router({ mergeParams: true });

const get = require('./get');
const post = require('./post');

const area = (csrf) => {
  logger.info('Mounting change password routes');

  router.use(isLoggedIn);

  router.get('/', csrf, get);
  router.post('/', csrf, post);

  return router;
};

module.exports = area;
