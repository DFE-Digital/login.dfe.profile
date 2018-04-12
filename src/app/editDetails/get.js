const Account = require('./../../infrastructure/account');
const { getUserDisplayName } = require('../../infrastructure/utils');

const action = (req, res) => {
  const account = Account.fromContext(req.user);
  res.render('editDetails/views/edit', {
    csrfToken: req.csrfToken(),
    givenName: account.givenName,
    displayName: account.user ? getUserDisplayName(account.user) : 'Unknown User',
    familyName: account.familyName,
    validationMessages: {},
    backLink: true,
  });
};

module.exports = action;
