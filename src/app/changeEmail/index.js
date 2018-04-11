'use strict';

const express = require('express');
const { isLoggedIn } = require('../../infrastructure/utils');
const logger = require('../../infrastructure/logger');
const { asyncWrapper } = require('login.dfe.express-error-handling');

const getNewEmailAddress = require('./getNewEmailAddress');
const postNewEmailAddress = require('./postNewEmailAddress');
const getVerifyEmail = require('./getVerifyEmail');
const postVerifyEmail = require('./postVerifyEmail');

const router = express.Router({ mergeParams: true });

const area = (csrf) => {
  logger.info('Mounting change email routes');

  router.use(isLoggedIn);

  router.get('/', csrf, asyncWrapper(getNewEmailAddress));
  router.post('/', csrf, asyncWrapper(postNewEmailAddress));

  router.get('/verify', csrf, asyncWrapper(getVerifyEmail));
  router.post('/verify', csrf, asyncWrapper(postVerifyEmail));

  return router;
};

module.exports = area;
