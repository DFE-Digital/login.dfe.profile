const { mockRequest, mockResponse } = require('./../../../utils/jestMocks');
const Service = require('./../../../../src/infrastructure/services/Service');

jest.mock('request-promise');
jest.mock('login.dfe.jwt-strategies', () => () => ({
  getBearerToken: () => 'token',
}));
jest.mock('./../../../../src/infrastructure/config', () => ({
  organisations: {
    service: {
      url: 'http://orgs.api.test',
    },
  },
}));

let adapter;

describe('when getting available services for a user', () => {
  let req;
  let res;


  beforeAll(() => {
    rp = jest.fn().mockReset().mockReturnValue([
      {
        id: 'service1',
        name: 'Service One',
        description: 'Some service',
      },
    ]);
    const requestPromise = require('request-promise');
    requestPromise.defaults.mockReturnValue(rp);
  });
  beforeEach(() => {
    req = mockRequest();
    res = mockResponse();

    adapter = require('./../../../../src/infrastructure/services/OrganisationsApiServicesAdapter');
  });

  it('then it should query organisations api', async () => {
    await adapter.getAvailableServicesForUser('user1');

    expect(rp.mock.calls).toHaveLength(1);
    expect(rp.mock.calls[0][0].uri).toBe('http://orgs.api.test/services/unassociated-with-user/user1');
  });

  it('then it should include the bearer token for authorization', async () => {
    await adapter.getAvailableServicesForUser('user1');

    expect(rp.mock.calls[0][0].headers).not.toBeNull();
    expect(rp.mock.calls[0][0].headers.authorization).toBe('Bearer token');
  });

  it('then it should map api result to array of Services', async () => {
    const actual = await adapter.getAvailableServicesForUser('user1');

    expect(actual).not.toBeNull();
    expect(actual).toBeInstanceOf(Array);
    expect(actual).toHaveLength(1);
    expect(actual[0]).toBeInstanceOf(Service);
    expect(actual[0].id).toBe('service1');
    expect(actual[0].name).toBe('Service One');
    expect(actual[0].description).toBe('Some service');
  });
});
