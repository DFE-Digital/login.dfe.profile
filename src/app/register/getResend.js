const getResend = async (req, res) => {
  return res.render('register/views/resend', {
    csrfToken: req.csrfToken(),
    invitationId: req.params.id,
    validationMessages: {},
    existingEmail: req.session.registration ? req.session.registration.email : null,
    email: req.session.registration ? req.session.registration.email : null,
    hideNav: true,
    backLink: true,
    title: 'Resend verification email - DfE Sign-in',
  });
};

module.exports = getResend;
