const { mockRequest, mockResponse } = require('./../../../utils/jestMocks');

jest.mock('login.dfe.request-promise-retry');
jest.mock('login.dfe.jwt-strategies', () => () => ({
  getBearerToken: () => 'token',
}));
jest.mock('agentkeepalive', () => ({
  HttpsAgent: jest.fn(),
}));
jest.mock('./../../../../src/infrastructure/config', () => ({
  hostingEnvironment: {
    agentKeepAlive: {},
  },
  organisations: {
    service: {
      url: 'http://orgs.api.test',
    },
  },
}));

let adapter;

describe('When putting a user in an organisation', () => {
  let req;
  let res;
  let rp;

  beforeAll(() => {
    rp = jest.fn().mockReset().mockReturnValue(
      {
        organisation: {
          name: 'Test Org',
        },
      },
    );
    const requestPromise = require('login.dfe.request-promise-retry');
    requestPromise.defaults.mockReturnValue(rp);
  });
  beforeEach(() => {
    req = mockRequest();
    res = mockResponse();

    adapter = require('./../../../../src/infrastructure/services/OrganisationsApiServicesAdapter');
  });

  it('then the request is made to the organisations API', async () => {
    await adapter.putUserInOrganisation('org1', 'user1');

    expect(rp.mock.calls).toHaveLength(1);
    expect(rp.mock.calls[0][0].uri).toBe('http://orgs.api.test/organisations/org1/users/user1');
    expect(rp.mock.calls[0][0].method).toBe('PUT');
  });
  it('then the bearer token for authorization is included', async () => {
    await adapter.putUserInOrganisation('org1');

    expect(rp.mock.calls[0][0].headers).not.toBeNull();
    expect(rp.mock.calls[0][0].headers.authorization).toBe('Bearer token');
  });
});

