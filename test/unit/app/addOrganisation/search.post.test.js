jest.mock('./../../../../src/infrastructure/services', () => ({
  searchOrganisations: jest.fn(),
  getOrganisationCategories: jest.fn(),
}));

const { mockRequest, mockResponse } = require('./../../../utils/jestMocks');
const { searchOrganisations, getOrganisationCategories } = require('./../../../../src/infrastructure/services');
const { post } = require('./../../../../src/app/addOrganisation/search');

const res = mockResponse();
const org1 = {
  id: 'org1',
  name: 'organisation one',
  category: {
    id: '001',
    name: 'Establishment',
  },
  type: {
    id: '44',
    name: 'Academy Special Converter',
  },
  urn: '356127',
  uid: null,
  ukprn: '123456789',
  establishmentNumber: '3535',
  status: {
    id: 1,
    name: 'Open',
  },
  closedOn: null,
  address: null,
};
const cat1 = {
  id: '001',
  name: 'Establishment',
};
const cat2 = {
  id: '002',
  name: 'Local Authority',
};
const cat3 = {
  id: '010',
  name: 'Multi-Academy Trust',
};

describe('when searching for an organisation to add to profile', () => {
  let req;

  beforeEach(() => {
    req = mockRequest({
      user: {
        sub: 'user1',
      },
      body: {
        criteria: 'organisation one',
        page: 2,
      },
    });

    res.mockResetAll();

    searchOrganisations.mockReset().mockReturnValue({
      organisations: [org1],
      page: 2,
      totalNumberOfPages: 5,
      totalNumberOfRecords: 100,
    });

    getOrganisationCategories.mockReset().mockReturnValue([cat1, cat2, cat3]);
  });

  it('then it should use criteria and page to search for organisations', async () => {
    await post(req, res);

    expect(searchOrganisations.mock.calls).toHaveLength(1);
    expect(searchOrganisations.mock.calls[0][0]).toBe('organisation one');
    expect(searchOrganisations.mock.calls[0][1]).toBe(2);
  });

  it('then it should render search view with results', async () => {
    await post(req, res);

    expect(res.render.mock.calls).toHaveLength(1);
    expect(res.render.mock.calls[0][0]).toBe('addOrganisation/views/search');
    expect(res.render.mock.calls[0][1]).toMatchObject({
      csrfToken: 'csrf-token',
      criteria: 'organisation one',
      organisations: [org1],
      page: 2,
      totalNumberOfPages: 5,
      totalNumberOfRecords: 100,
    });
  });

  it('then it should include organisation categories', async () => {
    await post(req, res);

    expect(res.render.mock.calls).toHaveLength(1);
    expect(res.render.mock.calls[0][1]).toMatchObject({
      categories: [
        Object.assign({ isSelected: false }, cat1),
        Object.assign({ isSelected: false }, cat2),
        Object.assign({ isSelected: false }, cat3),
      ],
    });
  });

  it('then it should include persist category filter selection', async () => {
    req.body.category = [cat1.id, cat3.id];

    await post(req, res);

    expect(res.render.mock.calls).toHaveLength(1);
    expect(res.render.mock.calls[0][1]).toMatchObject({
      categories: [
        Object.assign({ isSelected: true }, cat1),
        Object.assign({ isSelected: false }, cat2),
        Object.assign({ isSelected: true }, cat3),
      ],
    });
  });
});
