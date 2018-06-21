const getVerify = async (req, res) => {
  return res.render('register/views/verify', {
    csrfToken: req.csrfToken(),
    invitationId: req.params.id,
    code: '',
    validationMessages: {},
    email: req.session.registration ? req.session.registration.email : null,
    hideNav: true,
  });
};

module.exports = getVerify;
