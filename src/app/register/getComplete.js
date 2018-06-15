const { getInvitationById } = require('./../../infrastructure/invitations');
const { getOidcClientById } = require('./../../infrastructure/hotConfig');

const getComplete = async (req, res) => {
  const invitation = await getInvitationById(req.params.id);
  if (!invitation) {
    return res.status(404).render('register/views/invitationNotFound');
  }

  if (!req.session.registration || !req.session.registration.userId) {
    return res.redirect(`/register/${req.params.id}`);
  }

  const client = await getOidcClientById(invitation.origin.clientId);
  res.render('register/views/complete', {
    clientName: client.friendlyName,
    redirectUri: invitation.origin.redirectUri,
    hideNav: true,
  });
};

module.exports = getComplete;
