'use strict';

const express = require('express');
const logger = require('../../infrastructure/logger');
const { asyncWrapper } = require('login.dfe.express-error-handling');

const getDetails = require('./getDetails');
const postDetails = require('./postDetails');
const getVerify = require('./getVerify');
const postVerify = require('./postVerify');
const postResend = require('./postResend');
const getNewPassword = require('./getNewPassword');
const postNewPassword = require('./postNewPassword');
const getComplete = require('./getComplete');

const router = express.Router({ mergeParams: true });

const register = (csrf) => {
  logger.info('Mounting register routes');

  router.get('/', csrf, asyncWrapper(getDetails));
  router.post('/', csrf, asyncWrapper(postDetails));
  router.get('/:id', csrf, asyncWrapper(getVerify));
  router.post('/:id', csrf, asyncWrapper(postVerify));
  router.get('/:id/resend', csrf, asyncWrapper());
  router.post('/:id/resend', csrf, asyncWrapper(postResend));
  router.get('/:id/new-password', csrf, asyncWrapper(getNewPassword));
  router.post('/:id/new-password', csrf, asyncWrapper(postNewPassword));
  router.get('/:id/complete', asyncWrapper(getComplete));

  router.get('/:id/email-in-use', csrf, (req, res) => {
    res.render('register/views/emailInUse');
  });

  return router;
};

module.exports = register;
