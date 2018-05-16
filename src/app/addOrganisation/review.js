const { getOrganisation, putUserInOrganisation } = require('./../../infrastructure/services');

const get = async (req, res) => {
  const orgId = req.session.organisationId;

  if (!orgId) {
    return res.redirect('search');
  }

  const organisation = await getOrganisation(orgId);
  const model = {
    csrfToken: req.csrfToken(),
    organisation,
  };

  return res.render('addOrganisation/views/review', model);
};

const post = async (req, res) => {
  await putUserInOrganisation(req.body.organisationId, req.user.sub);

  req.session.organisationId = undefined;

  res.flash('info', `Your request for access to ${req.body.organisationName} has been submitted`);
  return res.redirect('/');
};

module.exports = {
  get,
  post,
};
