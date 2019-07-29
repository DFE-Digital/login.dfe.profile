const getNewPassword = async (req, res) => {
  if (!req.session.registration || !req.session.registration.codeVerified) {
    return res.redirect(`/register/${req.params.id}`);
  }

  res.render('register/views/newPassword', {
    csrfToken: req.csrfToken(),
    newPassword: '',
    confirmPassword: '',
    validationMessages: {},
    hideNav: true,
    title: 'Create password - DfE Sign-in',
  });
};

module.exports = getNewPassword;
