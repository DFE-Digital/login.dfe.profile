const getVerify = async (req, res) => {
  return res.render('register/views/verify', {
    csrfToken: req.csrfToken(),
    invitationId: req.params.id,
    code: '',
    validationMessages: {},
    email: req.session.registration ? req.session.registration.email : null,
    hideNav: true,
    title: 'Confirm your email address - DfE Sign-in',
  });
};

module.exports = getVerify;
