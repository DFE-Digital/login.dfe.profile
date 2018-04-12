const getNewEmailAddress = (req, res) => {
  res.render('changeEmail/views/enterNewAddress', {
    csrfToken: req.csrfToken(),
    newEmail: '',
    validationMessages: {},
    backLink: true,
  });
};

module.exports = getNewEmailAddress;
