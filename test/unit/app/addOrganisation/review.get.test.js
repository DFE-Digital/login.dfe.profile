jest.mock('./../../../../src/infrastructure/services', () => ({
  getOrganisation: jest.fn(),
}));
jest.mock('./../../../../src/infrastructure/config', () => ({
  hostingEnvironment: {
    agentKeepAlive: {},
  },
}));
jest.mock('./../../../../src/infrastructure/logger');
jest.mock('login.dfe.audit.winston-sequelize-transport');

const { mockRequest, mockResponse } = require('./../../../utils/jestMocks');
const { getOrganisation } = require('./../../../../src/infrastructure/services');
const { get } = require('./../../../../src/app/addOrganisation/review');

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


describe('when reviewing an organisation to add to a profile', () => {
  const expectedOrgId = '5544887';
  let req;

  beforeEach(() => {
    req = mockRequest({
      user: {
        sub: 'user1',
      },
      session: {
        organisationId: expectedOrgId,
      },
    });

    res.mockResetAll();

    getOrganisation.mockReset().mockReturnValue(org1);
  });

  it('then it will get the organisation based on organisation id stored in session', async () => {
    await get(req, res);

    expect(getOrganisation.mock.calls).toHaveLength(1);
    expect(getOrganisation.mock.calls[0][0]).toBe(expectedOrgId);
  });

  it('then it renders the review screen search view with results', async () => {
    await get(req, res);

    expect(res.render.mock.calls).toHaveLength(1);
    expect(res.render.mock.calls[0][0]).toBe('addOrganisation/views/review');
    expect(res.render.mock.calls[0][1]).toMatchObject({organisation: org1});
  });

  it('then if the organisation id is missing from the session it is redirected back to search', async () => {
    req.session = {};

    await get(req, res);

    expect(res.redirect.mock.calls).toHaveLength(1);
    expect(res.redirect.mock.calls[0][0]).toBe('search');
  });

});
