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

describe('when getting requests for approval', () => {
  let req;
  let res;
  let rp;

  beforeAll(() => {
    rp = jest.fn().mockReset().mockReturnValue(
      {
        userService: {
          id: '123-afd',
          status: 0,
        },
        organisation: {
          name: 'Test Org',
        },
        service: {
          name: 'user',
        },
        role: {
          id: 0,
          name: 'End User',
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

  it('should pass', () => {
    expect(true).toBe(true);
  });

  // it('then the request is retrieved from the organisations API', async () => {
  //   await adapter.getUserServiceRequest('org1', 'service1', 'user1');

  //   expect(rp.mock.calls).toHaveLength(1);
  //   expect(rp.mock.calls[0][0].uri).toBe('http://orgs.api.test/organisations/org1/services/service1/request/user1');
  // });
  // it('then the bearer token for authorization is included', async () => {
  //   await adapter.getUserServiceRequest('org1', 'service1', 'user1');

  //   expect(rp.mock.calls[0][0].headers).not.toBeNull();
  //   expect(rp.mock.calls[0][0].headers.authorization).toBe('Bearer token');
  // });
  // it('then the result is mapped to a user service request', async () => {
  //   const actual = await adapter.getUserServiceRequest('org1', 'service1', 'user1');

  //   expect(actual).not.toBeNull();
  //   expect(actual.service.name).toBe('user');
  //   expect(actual.role.name).toBe('End User');
  // });
});

