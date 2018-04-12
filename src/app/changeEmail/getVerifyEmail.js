const Account = require('./../../infrastructure/account');

const getVerifyEmail = async (req, res) => {
  const account = Account.fromContext(req.user);
  const code = await account.getChangeEmailCode(req.id);
  if (!code) {
    return res.redirect('/change-email');
  }

  return res.render('changeEmail/views/verifyEmailAddress', {
    csrfToken: req.csrfToken(),
    newEmail: code.email,
    code: '',
    validationMessages: {},
    backLink: true,
  });
};

module.exports = getVerifyEmail;
