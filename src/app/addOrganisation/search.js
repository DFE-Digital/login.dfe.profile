const { searchOrganisations } = require('./../../infrastructure/services');

const doSearch = async (req) => {
  const criteria = req.body.criteria || '';
  const page = req.body.page || 1;
  const results = await searchOrganisations(criteria, page);

  return results;
};

const getModel = (req, searchResults) => {
  const input = req.body || {};

  return Object.assign({
    csrfToken: req.csrfToken(),
    criteria: input.criteria || '',
  }, searchResults || {});
};

const get = (req, res) => {
  const model = getModel(req);
  return res.render('addOrganisation/views/search', model);
};

const post = async (req, res) => {
  const searchResults = await doSearch(req);
  const model = getModel(req, searchResults);
  return res.render('addOrganisation/views/search', model);
};

module.exports = {
  get,
  post,
};
