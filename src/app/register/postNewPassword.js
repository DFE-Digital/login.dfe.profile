const { getInvitationById, convertInvitationToUser } = require('./../../infrastructure/invitations');

const validateInput = (req) => {
  const model = {
    newPassword: req.body.newPassword,
    confirmPassword: req.body.confirmPassword,
    validationMessages: {},
  };

  if (!model.newPassword || model.newPassword.trim().length === 0) {
    model.validationMessages.newPassword = 'Please enter new password';
  } else if (model.newPassword.length < 12) {
    model.validationMessages.newPassword = 'Please enter new password that is at least 12 characters long';
  }

  if (!model.confirmPassword || model.confirmPassword.trim().length === 0) {
    model.validationMessages.confirmPassword = 'Please enter confirm password';
  } else if (model.confirmPassword.length < 12) {
    model.validationMessages.confirmPassword = 'Please enter confirm password that is at least 12 characters long';
  } else if (model.newPassword && model.newPassword !== model.confirmPassword) {
    model.validationMessages.confirmPassword = 'Passwords must match';
  }

  return model;
};

const postNewPassword = async (req, res) => {
  const invitation = await getInvitationById(req.params.id);
  if (!invitation) {
    return res.status(404).render('register/views/invitationNotFound');
  }

  if (!req.session.registration || !req.session.registration.codeVerified) {
    return res.redirect(`/register/${req.params.id}`);
  }

  const model = validateInput(req);
  if (Object.keys(model.validationMessages).length > 0) {
    model.csrfToken = req.csrfToken();
    return res.render('register/views/newPassword', model);
  }

  const user = await convertInvitationToUser(req.params.id, model.newPassword);
  req.session.registration.userId = user.id;
  return res.redirect(`/register/${req.params.id}/complete`);
};

module.exports = postNewPassword;
