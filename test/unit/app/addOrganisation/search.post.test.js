jest.mock('./../../../../src/infrastructure/services', () => ({
  searchOrganisations: jest.fn(),
}));

const { mockRequest, mockResponse } = require('./../../../utils/jestMocks');
const { searchOrganisations } = require('./../../../../src/infrastructure/services');
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
    expect(res.render.mock.calls[0][1]).toEqual({
      csrfToken: 'csrf-token',
      criteria: 'organisation one',
      organisations: [org1],
      page: 2,
      totalNumberOfPages: 5,
      totalNumberOfRecords: 100,
    });
  });
});
