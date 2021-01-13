const { validateRP, getBannerDetails } = require('./utils');

const getDetails = async (req, res) => {
  const isRequestValid = await validateRP(req);
  if (!isRequestValid) {
    return res.status(400).render('register/views/invalidRedirectUri');
  }

  const bannerDetails = await getBannerDetails(req);

  return res.render('register/views/details', {
    csrfToken: req.csrfToken(),
    firstName: '',
    lastName: '',
    email: '',
    validationMessages: {},
    hideNav: true,
    backLink: true,
    redirectUri: isRequestValid.redirectUri,
    header: bannerDetails.header,
    headerMessage: bannerDetails.headerMessage,
  });
};

module.exports = getDetails;
