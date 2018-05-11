const { searchOrganisations, getOrganisationCategories } = require('./../../infrastructure/services');

const fixMultiSelect = (value) => {
  if (!value) {
    return [];
  }
  if (value instanceof Array) {
    return value;
  }
  return [value];
};

const doSearch = async (req) => {
  const criteria = req.body.criteria || '';
  const page = req.body.page || 1;
  const results = await searchOrganisations(criteria, page, fixMultiSelect(req.body.category));

  return results;
};

const getModel = async (req, searchResults) => {
  const input = req.body || {};

  const model = {
    csrfToken: req.csrfToken(),
    criteria: input.criteria || '',
  };

  if (searchResults) {
    model.organisations = searchResults.organisations;
    model.page = searchResults.page;
    model.totalNumberOfPages = searchResults.totalNumberOfPages;
    model.totalNumberOfRecords = searchResults.totalNumberOfRecords;

    const selectedCategories = fixMultiSelect(input.category);
    model.categories = (await getOrganisationCategories()).map((item) => {
      return {
        id: item.id,
        name: item.name,
        isSelected: selectedCategories.find(x => x.toLowerCase() === item.id.toLowerCase()) !== undefined,
      };
    });
  }

  return model;
};

const get = async (req, res) => {
  const model = await getModel(req);
  return res.render('addOrganisation/views/search', model);
};

const post = async (req, res) => {
  const searchResults = await doSearch(req);
  const model = await getModel(req, searchResults);
  return res.render('addOrganisation/views/search', model);
};

module.exports = {
  get,
  post,
};
