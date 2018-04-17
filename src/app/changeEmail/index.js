'use strict';

const express = require('express');
const { isLoggedIn } = require('../../infrastructure/utils');
const logger = require('../../infrastructure/logger');
const { asyncWrapper } = require('login.dfe.express-error-handling');

const getNewEmailAddress = require('./getNewEmailAddress');
const postNewEmailAddress = require('./postNewEmailAddress');
const getVerifyEmail = require('./getVerifyEmail');
const postVerifyEmail = require('./postVerifyEmail');
const getComplete = require('./getComplete');
const postCancelChangeEmail = require('./postCancelChangeEmail');

const router = express.Router({ mergeParams: true });

const area = (csrf) => {
  logger.info('Mounting change email routes');

  router.get('/', isLoggedIn, csrf, asyncWrapper(getNewEmailAddress));
  router.post('/', isLoggedIn, csrf, asyncWrapper(postNewEmailAddress));

  router.get('/verify', isLoggedIn, csrf, asyncWrapper(getVerifyEmail));
  router.get('/:uid/verify', csrf, asyncWrapper(getVerifyEmail));
  router.post('/verify', isLoggedIn, csrf, asyncWrapper(postVerifyEmail));
  router.post('/:uid/verify', csrf, asyncWrapper(postVerifyEmail));

  router.get('/complete', asyncWrapper(getComplete));

  router.post('/cancel', asyncWrapper(postCancelChangeEmail));

  return router;
};

module.exports = area;
