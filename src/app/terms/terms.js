'use strict';

const { getUserDisplayName } = require('../../infrastructure/utils');

const profile = (req, res) => {
  res.render('terms/views/terms', {
    displayName: req.user ? getUserDisplayName(req.user) : 'Unknown User',
    title: 'Terms and conditions',
    user: req.user,
  });
};

module.exports = profile;
