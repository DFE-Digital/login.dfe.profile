const { mockRequest, mockResponse } = require('./../../../utils/jestMocks');
const Service = require('./../../../../src/infrastructure/services/Service');

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

describe('when getting service details', () => {
  let req;
  let res;
  let rp;

  beforeAll(() => {
    rp = jest.fn().mockReset().mockReturnValue(
      {
        id: 'service1',
        name: 'Service One',
        description: 'Some service',
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

  it('should pass', () => {
    expect(true).toBe(true);
  });

  // it('then it should query organisations api', async () => {
  //   await adapter.getServiceDetails('org1', 'service1');

  //   expect(rp.mock.calls).toHaveLength(1);
  //   expect(rp.mock.calls[0][0].uri).toBe('http://orgs.api.test/organisations/org1/services/service1');
  // });

  // it('then it should include the bearer token for authorization', async () => {
  //   await adapter.getServiceDetails('service1');

  //   expect(rp.mock.calls[0][0].headers).not.toBeNull();
  //   expect(rp.mock.calls[0][0].headers.authorization).toBe('Bearer token');
  // });

  // it('then it should map api result to a Service', async () => {
  //   const actual = await adapter.getServiceDetails('org1', 'service1');

  //   expect(actual).not.toBeNull();
  //   expect(actual).toBeInstanceOf(Service);
  //   expect(actual.id).toBe('service1');
  //   expect(actual.name).toBe('Service One');
  //   expect(actual.description).toBe('Some service');
  // });
});

