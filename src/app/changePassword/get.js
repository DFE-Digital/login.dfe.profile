const action = (req, res) => {
  res.render('changePassword/views/change', {
    csrfToken: req.csrfToken(),
    title: 'Change password',
    validationFailed: false,
    validationMessages: {},
  });
};

module.exports = action;
