const { getInvitationById, createInvitation } = require('./../../infrastructure/invitations');

const postResend = async (req, res) => {
  let firstName;
  let lastName;
  let email;
  let clientId;
  let redirectUri;

  if (req.session.registration && req.session.registration.invitationId === req.params.id) {
    firstName = req.session.registration.firstName;
    lastName = req.session.registration.lastName;
    email = req.session.registration.email;
    clientId = req.session.registration.clientId;
    redirectUri = req.session.registration.redirectUri;
  } else {
    const invitation = await getInvitationById(req.params.id);
    if (invitation) {
      firstName = invitation.firstName;
      lastName = invitation.lastName;
      email = invitation.email;
      clientId = invitation.origin.clientId;
      redirectUri = invitation.origin.redirectUri;
    }
  }

  if (email) {
    await createInvitation(firstName, lastName, email, clientId, redirectUri);
  }

  res.redirect(`/register/${req.params.id}`);
};

module.exports = postResend;
