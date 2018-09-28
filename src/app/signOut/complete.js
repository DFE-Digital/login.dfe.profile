'use strict';

const config = require('./../../infrastructure/config');

const complete = (req, res) => {
  res.redirect(config.hostingEnvironment.servicesUrl);
};

module.exports = complete;
