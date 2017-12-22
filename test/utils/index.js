'use strict';

const express = require('express');
const expressLayouts = require('express-ejs-layouts');

const expressAppWithViews = (viewPath) => {
  let app = express();
  app.use(expressLayouts);
  app.set('view engine', 'ejs');
  app.set('views', viewPath);
  app.set('layout', 'layouts/layout');
  return app;
};

const expressAuthenticationStub = (authenticated, extras) => {
  return (req, res, next) => {
    req.isAuthenticated = () => {
      return authenticated;
    };
    req.user = {};
    Object.assign(req, extras);

    if (!res.locals) {
      res.locals = {};
    }
    res.locals.flash = {};

    next();
  };
};

module.exports = {
  expressAppWithViews,
  expressAuthenticationStub
};

