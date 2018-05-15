const { getOrganisation } = require('./../../infrastructure/services');

const get = async (req, res) => {
  const orgId = req.session.organisationId;

  if (!orgId) {
    return res.redirect('search');
  }

  const model = await getOrganisation(orgId);
  return res.render('addOrganisation/views/review', model);
};

module.exports = {
  get,
};
