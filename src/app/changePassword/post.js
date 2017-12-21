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
    messages.oldPassword = 'Enter your current password';
    failed = true;
  }

  if (!newPassword) {
    messages.newPassword = 'Enter a new password';
    failed = true;
  } else {
    if (!passwordPolicy.doesPasswordMeetPolicy(newPassword)) {
      messages.newPassword = 'Your password does not meet the minimum requirements';
      failed = true;
    }
    if (!confirmPassword) {
      messages.confirmPassword = 'Passwords do not match';
      failed = true;
    }
  }

  if (newPassword && confirmPassword && newPassword !== confirmPassword) {
    messages.confirmPassword = 'Passwords do not match';
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
  const oldPasswordIsCorrect = await account.validatePassword(oldPassword);
  if (!oldPasswordIsCorrect) {
    logger.audit(`Failed changed password for ${account.email} (id: ${account.id}) - Incorrect current password`, {
      type: 'change-password',
      success: false,
      userId: account.id,
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

  await account.setPassword(newPassword);
  logger.audit(`Successfully changed password for ${account.email} (id: ${account.id})`, {
    type: 'change-password',
    success: true,
    userId: account.id,
  });

  res.flash('info', 'Your password has been changed');
  res.redirect('/');
};

module.exports = action;
