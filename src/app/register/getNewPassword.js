const { getInvitationById } = require('./../../infrastructure/invitations');

const getNewPassword = async (req, res) => {
  const invitation = await getInvitationById(req.params.id);
  if (!invitation) {
    return res.status(404).render('register/views/invitationNotFound');
  }

  if (!req.session.registration || !req.session.registration.codeVerified) {
    return res.redirect(`/register/${req.params.id}`);
  }

  res.render('register/views/newPassword', {
    csrfToken: req.csrfToken(),
    newPassword: '',
    confirmPassword: '',
    validationMessages: {},
  });
};

module.exports = getNewPassword;
