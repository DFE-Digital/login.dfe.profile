'use strict';

const express = require('express');
const { isLoggedIn } = require('../../infrastructure/utils');
const logger = require('../../infrastructure/logger');
const { asyncWrapper } = require('login.dfe.express-error-handling');

const getNewEmailAddress = require('./getNewEmailAddress');
const postNewEmailAddress = require('./postNewEmailAddress');

const router = express.Router({ mergeParams: true });

const area = (csrf) => {
  logger.info('Mounting change email routes');

  router.use(isLoggedIn);

  router.get('/', csrf, asyncWrapper(getNewEmailAddress));
  router.post('/', csrf, asyncWrapper(postNewEmailAddress));

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
