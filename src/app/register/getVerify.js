const getVerify = async (req, res) => {
  return res.render('register/views/verify', {
    csrfToken: req.csrfToken(),
    code: '',
    validationMessages: {},
  });
};

module.exports = getVerify;
