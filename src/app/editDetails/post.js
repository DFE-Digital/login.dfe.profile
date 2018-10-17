const Account = require('./../../infrastructure/account');
const logger = require('./../../infrastructure/logger');

const validateInput = (req) => {
  const model = {
    givenName: req.body.givenName,
    familyName: req.body.familyName,
    validationMessages: {},
    backLink: true,
  };

  if (!model.givenName || model.givenName.trim().length === 0) {
    model.validationMessages.givenName = 'Please enter your first name';
  }

  if (!model.familyName || model.familyName.trim().length === 0) {
    model.validationMessages.familyName = 'Please enter your last name';
  }

  return model;
};

const action = async (req, res) => {
  const model = validateInput(req);
  if (Object.keys(model.validationMessages).length > 0) {
    model.csrfToken = req.csrfToken();
    return res.render('editDetails/views/edit', model);
  }

  const account = Account.fromContext(req.user);
  account.givenName = model.givenName;
  account.familyName = model.familyName;
  await account.update(req.id);
  logger.audit(`Successfully changed name to ${account.givenName} ${account.familyName} (id: ${account.id})`, {
    type: 'change-name',
    success: true,
    userId: account.id,
    reqId: req.id,
  });
  res.flash('info', 'Your details have been updated');
  return res.redirect('/');
};

module.exports = action;
