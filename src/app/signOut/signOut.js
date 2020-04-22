'use strict';

/* eslint-disable no-underscore-dangle */

const url = require('url');
const passport = require('passport');
const config = require('./../../infrastructure/config');
const logger = require('../../infrastructure/logger');

const signUserOut = (req, res) => {
  if ((req.user && req.user.id_token) || req.query.redirected === 'true') {
    logger.audit('User logged out', {
      type: 'Sign-out',
      userId: req.user.sub,
      email: req.user.email,
      client: 'profiles',
    });
    const idToken = req.user.id_token;
    const issuer = passport._strategies.oidc._issuer;
    let returnUrl = `${config.hostingEnvironment.servicesUrl}/signout?redirected=true`;
    if (req.query.redirect_uri) {
      returnUrl += `&redirect_uri=${req.query.redirect_uri}`;
    }
    req.logout();
    res.redirect(url.format(Object.assign(url.parse(issuer.end_session_endpoint), {
      search: null,
      query: {
        id_token_hint: idToken,
        post_logout_redirect_uri: returnUrl,
      },
    })));
  } else {
    res.redirect(req.query.redirect_uri ? req.query.redirect_uri : '/');
  }
};

module.exports = signUserOut;

