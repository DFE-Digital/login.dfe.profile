const { getInvitationById } = require('./../../infrastructure/invitations');
const { getByEmail: getAccountByEmail } = require('./../../infrastructure/account');

const validateInput = async (req, invitation) => {
  const model = {
    code: req.body.code,
    validationMessages: {},

    firstName: invitation.firstName,
    lastName: invitation.lastName,
    email: invitation.email,
    clientId: invitation.origin.clientId,
    redirectUri: invitation.origin.redirectUri,
  };

  if (!model.code || model.code.trim().length === 0) {
    model.validationMessages.code = 'Please enter code';
  } else if (model.code.toLowerCase() !== invitation.code.toLowerCase()) {
    model.validationMessages.code = 'Failed to verify code';
  }

  return model;
};

const postVerify = async (req, res) => {
  const invitation = await getInvitationById(req.params.id);
  if (!invitation) {
    return res.status(404).render('register/views/invitationNotFound');
  }

  const model = await validateInput(req, invitation);
  if (Object.keys(model.validationMessages).length > 0) {
    model.csrfToken = req.csrfToken();
    return res.render('register/views/verify', model);
  }

  const existingAccountWithEmail = await getAccountByEmail(invitation.email);
  if (existingAccountWithEmail) {
    return res.redirect(`/register/${invitation.id}/email-in-use`);
  }

  req.session.registration = {
    codeVerified: true,
  };
  return res.redirect(`/register/${invitation.id}/new-password`);
};

module.exports = postVerify;
