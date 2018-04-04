const { getInvitationById } = require('./../../infrastructure/invitations');

const getVerify = async (req, res) => {
  const invitation = await getInvitationById(req.params.id);
  if (!invitation) {
    return res.status(404).render('register/views/invitationNotFound');
  }

  return res.render('register/views/verify', {
    csrfToken: req.csrfToken(),
    firstName: invitation.firstName,
    lastName: invitation.lastName,
    email: invitation.email,
    clientId: invitation.origin.clientId,
    redirectUri: invitation.origin.redirectUri,
    code: '',
    validationMessages: {},
  });
};

module.exports = getVerify;
