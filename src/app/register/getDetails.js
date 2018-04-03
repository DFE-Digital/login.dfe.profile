const { validateRP } = require('./utils');

const getDetails = async (req, res) => {
  const isRequestValid = await validateRP(req);
  if (!isRequestValid) {
    return res.status(400).render('register/views/invalidRedirectUri');
  }

  return res.render('register/views/details', {
    csrfToken: req.csrfToken(),
    firstName: '',
    lastName: '',
    email: '',
    validationMessages: {},
  });
};

module.exports = getDetails;
