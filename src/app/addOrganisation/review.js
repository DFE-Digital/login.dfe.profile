const { getOrganisation, putUserInOrganisation } = require('./../../infrastructure/services');
const logger = require('./../../infrastructure/logger');

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

  logger.audit(`Request made by user ${req.user.email} to add organisation '${req.body.organisationName}' (id: ${req.body.organisationId}) - To their user account`, {
    type: 'user-add-organisation',
    success: true,
    userId: req.user.sub,
    reqId: req.id,
  });

  req.session.organisationId = undefined;

  res.flash('info', `Your request for access to ${req.body.organisationName} has been submitted`);
  return res.redirect('/');
};

module.exports = {
  get,
  post,
};
