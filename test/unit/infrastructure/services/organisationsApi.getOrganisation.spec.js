const { mockRequest, mockResponse } = require('./../../../utils/jestMocks');

jest.mock('request-promise');
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

describe('When getting an organisation', () => {
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
    const requestPromise = require('request-promise');
    requestPromise.defaults.mockReturnValue(rp);
  });
  beforeEach(() => {
    req = mockRequest();
    res = mockResponse();

    adapter = require('./../../../../src/infrastructure/services/OrganisationsApiServicesAdapter');
  });

  it('then the request is retrieved from the organisations API', async () => {
    await adapter.getOrganisation('org1');

    expect(rp.mock.calls).toHaveLength(1);
    expect(rp.mock.calls[0][0].uri).toBe('http://orgs.api.test/organisations/org1');
  });
  it('then the bearer token for authorization is included', async () => {
    await adapter.getOrganisation('org1');

    expect(rp.mock.calls[0][0].headers).not.toBeNull();
    expect(rp.mock.calls[0][0].headers.authorization).toBe('Bearer token');
  });
  it('then the result is mapped to an organisation', async () => {
    const actual = await adapter.getOrganisation('org1');

    expect(actual).not.toBeNull();
    expect(actual.organisation.name).toBe('Test Org');
  });
});

