const Account = require('./../../infrastructure/account');
const logger = require('../../infrastructure/logger');

const validateInput = (req, code) => {
  const model = {
    newEmail: code.email,
    code: req.body.code || '',
    validationMessages: {},
    currentPage: 'profile',
  };

  if (!model.code || model.code.trim().length === 0) {
    model.validationMessages.code = 'Please enter verification code';
  } else if (model.code.toLowerCase() !== code.code.toLowerCase()) {
    model.validationMessages.code = 'Invalid code';
  }

  return model;
};

const postVerifyEmail = async (req, res) => {
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

  const model = await validateInput(req, code);
  if (Object.keys(model.validationMessages).length > 0) {
    model.csrfToken = req.csrfToken();
    model.backLink = true;
    logger.audit(`Failed changed email to ${account.email} (id: ${account.id}) - invalid code`, {
      type: 'change-email',
      success: false,
      userId: account.id,
      reqId: req.id,
    });
    return res.render('changeEmail/views/verifyEmailAddress', model);
  }

  account.email = code.email;
  await account.update(req.id);
  await account.deleteChangeEmailCode(req.id);
  logger.audit(`Successfully changed email to ${account.email} (id: ${account.id})`, {
    type: 'change-email',
    success: true,
    userId: account.id,
    reqId: req.id,
    editedFields: [{
      name: 'new_email',
      newValue: account.email,
    }],
  });
  if (req.params.uid) {
    res.redirect('/change-email/complete');
  } else {
    res.flash('info', 'Your email address has been changed');
    res.redirect('/');
  }
};

module.exports = postVerifyEmail;
