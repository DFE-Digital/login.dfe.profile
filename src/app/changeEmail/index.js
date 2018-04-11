'use strict';

const express = require('express');
const { isLoggedIn } = require('../../infrastructure/utils');
const logger = require('../../infrastructure/logger');
const { asyncWrapper } = require('login.dfe.express-error-handling');

const router = express.Router({ mergeParams: true });

const area = (csrf) => {
  logger.info('Mounting change email routes');

  router.use(isLoggedIn);

  router.get('/', csrf, asyncWrapper((req, res) => {
    res.render('changeEmail/views/enterNewAddress', {
      csrfToken: req.csrfToken(),
      newEmail: '',
      validationMessages: {},
    });
  }));
  router.post('/', csrf, asyncWrapper((req, res) => {
    res.redirect('/change-email/verify');
  }));

  router.get('/verify', csrf, asyncWrapper((req, res) => {
    res.render('changeEmail/views/verifyEmailAddress', {
      csrfToken: req.csrfToken(),
      newEmail: 'steve.rodgers@avengers.com',
      code: '',
      validationMessages: {},
    });
  }));
  router.post('/verify', csrf, asyncWrapper((req, res) => {
    res.flash('info', 'Your email address has been changed');
    res.redirect('/');
  }));

  return router;
};

module.exports = area;
