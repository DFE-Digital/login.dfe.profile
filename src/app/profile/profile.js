'use strict';

const Account = require('./../../infrastructure/account');
const { getUserDisplayName } = require('./../../infrastructure/utils');

const profile = async (req, res) => {
  const account = Account.fromContext(req.user);
  const changeEmailCode = await account.getChangeEmailCode(req.id);

  res.render('profile/views/profile', {
    csrfToken: req.csrfToken(),
    displayName: req.user ? getUserDisplayName(req.user) : 'Unknown User',
    user: req.user,
    pendingEmail: changeEmailCode ? changeEmailCode.email : undefined,
  });
};

module.exports = profile;
