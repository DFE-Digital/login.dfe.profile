const Account = require('./../../infrastructure/account');

const action = (req, res) => {
  const account = Account.fromContext(req.user);
  res.render('editDetails/views/edit', {
    csrfToken: req.csrfToken(),
    givenName: account.givenName,
    familyName: account.familyName,
    validationMessages: {},
  });
};

module.exports = action;
