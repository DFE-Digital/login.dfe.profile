'use strict';

const express = require('express');
const logger = require('../../infrastructure/logger');
const getIndex = require('./terms');

const router = express.Router({ mergeParams: true });

const terms = () => {
  logger.info('Mounting terms route');

  router.get('/', getIndex);

  return router;
};

module.exports = terms;
