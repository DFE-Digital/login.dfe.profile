const getNewPassword = async (req, res) => {
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
