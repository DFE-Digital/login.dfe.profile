const { getInvitationById } = require('./../../infrastructure/invitations');
const { getApplication } = require('./../../infrastructure/applications');

const getComplete = async (req, res) => {
  const invitation = await getInvitationById(req.params.id);
  if (!invitation) {
    return res.status(404).render('register/views/invitationNotFound');
  }

  if (!req.session.registration || !req.session.registration.userId) {
    return res.redirect(`/register/${req.params.id}`);
  }

  const client = await getApplication(invitation.origin.clientId, req.id);
  res.render('register/views/complete', {
    clientName: client.name,
    redirectUri: invitation.origin.redirectUri,
    hideNav: true,
    title: 'Registration complete - DfE Sign-in',
  });
};

module.exports = getComplete;
