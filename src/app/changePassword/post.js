const Account = require('./../../infrastructure/account');
const logger = require('./../../infrastructure/logger');
const { passwordPolicy } = require('login.dfe.validation');

const validate = (oldPassword, newPassword, confirmPassword) => {
  const messages = {
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  };
  let failed = false;

  if (!oldPassword) {
    messages.oldPassword = 'Please enter your current password';
    failed = true;
  }

  if (!newPassword) {
    messages.newPassword = 'Please enter a password';
    failed = true;
  } else {
    if (!passwordPolicy.doesPasswordMeetPolicy(newPassword)) {
      messages.newPassword = 'Please enter a password of at least 12 characters';
      failed = true;
    }
    if (!confirmPassword) {
      messages.confirmPassword = 'Please enter matching passwords';
      failed = true;
    }
  }

  if (newPassword && confirmPassword && newPassword !== confirmPassword) {
    messages.confirmPassword = 'Please enter matching passwords';
    failed = true;
  }

  return {
    failed,
    messages,
  };
};

const action = async (req, res) => {
  const oldPassword = req.body.oldPassword;
  const newPassword = req.body.newPassword;
  const confirmPassword = req.body.confirmPassword;

  const validationResult = validate(oldPassword, newPassword, confirmPassword);
  if (validationResult.failed) {
    res.render('changePassword/views/change', {
      csrfToken: req.csrfToken(),
      validationFailed: true,
      title: 'Change password',
      validationMessages: validationResult.messages,
    });
    return;
  }

  const account = Account.fromContext(req.user);
  const oldPasswordIsCorrect = await account.validatePassword(oldPassword, req.id);
  if (!oldPasswordIsCorrect) {
    logger.audit(`Failed changed password for ${account.email} (id: ${account.id}) - Incorrect current password`, {
      type: 'change-password',
      success: false,
      userId: account.id,
      reqId: req.id,
    });

    res.render('changePassword/views/change', {
      csrfToken: req.csrfToken(),
      validationFailed: true,
      title: 'Change password',
      validationMessages: {
        oldPassword: 'We do not recognise the password you entered. Please check and try again.',
        newPassword: '',
        confirmPassword: '',
      },
    });

    return;
  }

  await account.setPassword(newPassword, req.id);
  logger.audit(`Successfully changed password for ${account.email} (id: ${account.id})`, {
    type: 'change-password',
    success: true,
    userId: account.id,
    reqId: req.id,
  });

  res.flash('info', 'Your password has been changed');
  res.redirect('/');
};

module.exports = action;
