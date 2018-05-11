'use strict';

const express = require('express');
const { isLoggedIn } = require('../../infrastructure/utils');
const logger = require('../../infrastructure/logger');
const { asyncWrapper } = require('login.dfe.express-error-handling');

const search = require('./search');

const router = express.Router({ mergeParams: true });

const area = (csrf) => {
  logger.info('Mounting add organisation routes');

  router.get('/search', isLoggedIn, csrf, asyncWrapper(search.get));
  router.post('/search', isLoggedIn, csrf, asyncWrapper(search.post));

  return router;
};

module.exports = area;
