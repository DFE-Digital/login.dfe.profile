const getNewEmailAddress = (req, res) => {
  res.render('changeEmail/views/enterNewAddress', {
    csrfToken: req.csrfToken(),
    newEmail: '',
    validationMessages: {},
  });
};

module.exports = getNewEmailAddress;
