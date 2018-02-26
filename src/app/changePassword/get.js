const { getUserDisplayName } = require('../../infrastructure/utils');

const action = (req, res) => {
  res.render('changePassword/views/change', {
    csrfToken: req.csrfToken(),
    title: 'Change password',
    displayName: req.user ? getUserDisplayName(req.user) : 'Unknown User',
    user: req.user,
    validationFailed: false,
    validationMessages: {},
  });
};

module.exports = action;
