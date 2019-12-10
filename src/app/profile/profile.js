'use strict';

const Account = require('./../../infrastructure/account');
const { getUserDisplayName } = require('./../../infrastructure/utils');
const config = require('./../../infrastructure/config');

const profile = async (req, res) => {
  const account = Account.fromContext(req.user);
  const changeEmailCode = await account.getChangeEmailCode(req.id);

  res.render('profile/views/profile', {
    csrfToken: req.csrfToken(),
    displayName: req.user ? getUserDisplayName(req.user) : 'Unknown User',
    user: req.user,
    currentPage: 'profile',
    pendingEmail: changeEmailCode ? changeEmailCode.email : undefined,
    approverRequests: req.approverRequests || [],
    servicesUrl: config.hostingEnvironment.servicesUrl,
  });
};

module.exports = profile;
