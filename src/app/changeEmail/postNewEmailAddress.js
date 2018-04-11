const Account = require('./../../infrastructure/account');
const emailValidator = require('email-validator');

const validateInput = async (req) => {
  const model = {
    newEmail: req.body.newEmail || '',
    validationMessages: {},
  };

  if (!model.newEmail || model.newEmail.trim().length === 0) {
    model.validationMessages.newEmail = 'Please enter your new email address';
  } else if (!emailValidator.validate(model.newEmail)) {
    model.validationMessages.newEmail = 'Please enter a valid new email address';
  } else if (await Account.getByEmail(model.newEmail)) {
    model.validationMessages.newEmail = 'Email address is already associated to an account';
  }

  return model;
};

const postNewEmailAddress = async (req, res) => {
  const model = await validateInput(req);
  if (Object.keys(model.validationMessages).length > 0) {
    model.csrfToken = req.csrfToken();
    return res.render('changeEmail/views/enterNewAddress', model);
  }

  const account = Account.fromContext(req.user);
  await account.generateChangeEmailCode(req.body.newEmail, req.id);

  return res.redirect('/change-email/verify');
};

module.exports = postNewEmailAddress;
