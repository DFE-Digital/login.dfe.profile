const Account = require('./../../infrastructure/account');

const getVerifyEmail = async (req, res) => {
  let account;
  if (req.params.uid) {
    account = await Account.getById(req.params.uid);
  } else {
    account = Account.fromContext(req.user);
  }
  const code = await account.getChangeEmailCode(req.id);
  if (!code) {
    return res.redirect('/change-email');
  }

  return res.render('changeEmail/views/verifyEmailAddress', {
    csrfToken: req.csrfToken(),
    newEmail: code.email,
    code: '',
    validationMessages: {},
    backLink: req.params.uid ? undefined : true,
    includeResend: !req.params.uid,
  });
};

module.exports = getVerifyEmail;
