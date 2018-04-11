const Account = require('./../../infrastructure/account');

const validateInput = (req, code) => {
  const model = {
    newEmail: code.newEmail,
    code: req.body.code || '',
    validationMessages: {},
  };

  if (!model.code || model.code.trim().length === 0) {
    model.validationMessages.code = 'Please enter verification code';
  } else if (model.code.toLowerCase() !== code.code.toLowerCase()) {
    model.validationMessages.code = 'Invalid code';
  }

  return model;
};

const postVerifyEmail = async (req, res) => {
  const account = Account.fromContext(req.user);
  const code = account.getChangeEmailCode();
  if (!code) {
    return res.redirect('/change-email');
  }

  const model = await validateInput(req, code);
  if (Object.keys(model.validationMessages).length > 0) {
    model.csrfToken = req.csrfToken();
    return res.render('changeEmail/views/verifyEmailAddress', model);
  }

  res.flash('info', 'Your email address has been changed');
  res.redirect('/');
};

module.exports = postVerifyEmail;
