const { getInvitationById } = require('./../../infrastructure/invitations');
const { getByEmail: getAccountByEmail } = require('./../../infrastructure/account');

const validateInput = async (req, invitation) => {
  const model = {
    invitationId: req.params.id,
    code: req.body.code,
    validationMessages: {},
    email: req.session.registration ? req.session.registration.email : null,
    hideNav: true,
  };

  if (!model.code || model.code.trim().length === 0) {
    model.validationMessages.code = 'Please enter your verification code';
  } else if (!invitation || model.code.toLowerCase() !== invitation.code.toLowerCase()) {
    model.validationMessages.code = 'The verification code is incorrect';
  } else if (invitation && invitation.deactivated) {
    model.validationMessages.code = 'Invitation has been deactivated';
  }

  return model;
};

const postVerify = async (req, res) => {
  const invitation = await getInvitationById(req.params.id);
  const model = await validateInput(req, invitation);

  if (Object.keys(model.validationMessages).length > 0) {
    model.csrfToken = req.csrfToken();
    return res.render('register/views/verify', model);
  }

  const existingAccountWithEmail = await getAccountByEmail(invitation.email);
  if (existingAccountWithEmail) {
    return res.redirect(`/register/${invitation.id}/email-in-use`);
  }

  if (!req.session.registration) {
    req.session.registration = {};
  }
  req.session.registration.codeVerified = true;

  return res.redirect(`/register/${invitation.id}/new-password`);
};

module.exports = postVerify;
