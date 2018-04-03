const { getInvitationById } = require('./../../infrastructure/invitations');
const { getByEmail: getAccountByEmail } = require('./../../infrastructure/account');

const validateInput = async (req) => {
  const model = {
    invitationId: req.params.id,
    code: req.body.code,
    validationMessages: {},
  };

  if (!model.code || model.code.trim().length === 0) {
    model.validationMessages.code = 'Please enter code';
  } else {
    model.invitation = await getInvitationById(model.invitationId);
    if (!model.invitation) {
      model.validationMessages.code = 'Failed to verify code';
    } else if (model.code.toLowerCase() !== model.invitation.code.toLowerCase()) {
      model.validationMessages.code = 'Failed to verify code';
    }
  }

  return model;
};

const postVerify = async (req, res) => {
  const model = await validateInput(req);
  if (Object.keys(model.validationMessages).length > 0) {
    model.csrfToken = req.csrfToken();
    return res.render('register/views/verify', model);
  }

  const existingAccountWithEmail = await getAccountByEmail(model.invitation.email);
  if (existingAccountWithEmail) {
    return res.redirect(`/register/${model.invitationId}/email-in-use`);
  }

  req.session.registration = {
    codeVerified: true,
  };
  return res.redirect(`/register/${model.invitationId}/new-password`);
};

module.exports = postVerify;
