const getVerify = async (req, res) => {
  return res.render('register/views/verify', {
    csrfToken: req.csrfToken(),
    invitationId: req.params.id,
    code: '',
    validationMessages: {},
  });
};

module.exports = getVerify;
