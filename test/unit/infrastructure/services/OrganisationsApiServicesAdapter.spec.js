const { mockRequest, mockResponse } = require('./../../../utils/jestMocks');
const Service = require('./../../../../src/infrastructure/services/Service');
const ServiceUser = require('./../../../../src/infrastructure/services/ServiceUser');

jest.mock('request-promise');
jest.mock('login.dfe.jwt-strategies', () => () => ({
  getBearerToken: () => 'token',
}));
jest.mock('./../../../../src/infrastructure/config', () => {
  return {
    organisations: {
      service: {
        url: 'http://orgs.api.test',
      },
    },
  };
});

const adapter = require('./../../../../src/infrastructure/services/OrganisationsApiServicesAdapter');

describe('when getting available services for a user', () => {
  let req;
  let res;
  let rp;

  beforeEach(() => {
    req = mockRequest();
    res = mockResponse();

    rp = require('request-promise');
    rp.mockReturnValue([
      {
        id: 'service1',
        name: 'Service One',
        description: 'Some service',
      },
    ]);
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

describe('when getting service details', () => {
  let req;
  let res;
  let rp;

  beforeEach(() => {
    req = mockRequest();
    res = mockResponse();

    rp = require('request-promise');
    rp.mockReturnValue(
      {
        id: 'service1',
        name: 'Service One',
        description: 'Some service',
      },
    );
  });

  it('then it should query organisations api', async () => {
    await adapter.getServiceDetails('org1', 'service1');

    expect(rp.mock.calls).toHaveLength(1);
    expect(rp.mock.calls[0][0].uri).toBe('http://orgs.api.test/organisations/org1/services/service1');
  });

  it('then it should include the bearer token for authorization', async () => {
    await adapter.getServiceDetails('service1');

    expect(rp.mock.calls[0][0].headers).not.toBeNull();
    expect(rp.mock.calls[0][0].headers.authorization).toBe('Bearer token');
  });

  it('then it should map api result to a Service', async () => {
    const actual = await adapter.getServiceDetails('service1');

    expect(actual).not.toBeNull();
    expect(actual).toBeInstanceOf(Service);
    expect(actual.id).toBe('service1');
    expect(actual.name).toBe('Service One');
    expect(actual.description).toBe('Some service');
  });
});

describe('when getting service users', () => {
  let req;
  let res;
  let rp;

  beforeEach(() => {
    req = mockRequest();
    res = mockResponse();

    rp = require('request-promise');
    rp.mockReturnValue([
      {
        id: 'user1',
        name: 'User One',
        role: {
          id: 0,
          name: 'user',
        },
      },
    ]);
  });

  it('then it should query organisations api', async () => {
    await adapter.getServiceUsers('org1', 'service1');

    expect(rp.mock.calls).toHaveLength(1);
    expect(rp.mock.calls[0][0].uri).toBe('http://orgs.api.test/organisations/org1/services/service1/users');
  });

  it('then it should include the bearer token for authorization', async () => {
    await adapter.getServiceUsers('service1');

    expect(rp.mock.calls[0][0].headers).not.toBeNull();
    expect(rp.mock.calls[0][0].headers.authorization).toBe('Bearer token');
  });

  it('then it should map api result to an array of ServiceUser', async () => {
    const actual = await adapter.getServiceUsers('service1');

    expect(actual).not.toBeNull();
    expect(actual).toBeInstanceOf(Array);
    expect(actual).toHaveLength(1);
    expect(actual[0].id).toBe('user1');
    expect(actual[0].name).toBe('User One');
    expect(actual[0].role.id).toBe(0);
    expect(actual[0].role.name).toBe('user');
  });
});

describe('when getting requests for approval', () => {
  let req;
  let res;
  let rp;

  beforeEach(() => {
    req = mockRequest();
    res = mockResponse();

    rp = require('request-promise');
    rp.mockReturnValue(
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
  });

  it('then the request is retrieved from the organisations API', async () => {
    await adapter.getUserServiceRequest('org1', 'service1', 'user1');

    expect(rp.mock.calls).toHaveLength(1);
    expect(rp.mock.calls[0][0].uri).toBe('http://orgs.api.test/organisations/org1/services/service1/request/user1');
  });
  it('then the bearer token for authorization is included', async () => {
    await adapter.getUserServiceRequest('org1', 'service1', 'user1');

    expect(rp.mock.calls[0][0].headers).not.toBeNull();
    expect(rp.mock.calls[0][0].headers.authorization).toBe('Bearer token');
  });
  it('then the result is mapped to a user service request', async () => {
    const actual = await adapter.getUserServiceRequest('org1', 'service1', 'user1');

    expect(actual).not.toBeNull();
    expect(actual.service.name).toBe('user');
    expect(actual.role.name).toBe('End User');
  });
});

describe('when getting approvers of a service', () => {
  let req;
  let res;
  let rp;

  beforeEach(() => {
    req = mockRequest();
    res = mockResponse();

    rp = require('request-promise');
    rp.mockReturnValue(
      [{
        id: '123-afd',
      }, {
        id: '456-cdf',
      }],
    );
  });
  it('then the request is retrieved from the organisations API', async () => {
    await adapter.getApproversForService('org1', 'service1');

    expect(rp.mock.calls).toHaveLength(1);
    expect(rp.mock.calls[0][0].uri).toBe('http://orgs.api.test/organisations/org1/services/service1/approvers');
  });
  it('then the bearer token for authorization is included', async () => {
    await adapter.getApproversForService('org1', 'service1');

    expect(rp.mock.calls[0][0].headers).not.toBeNull();
    expect(rp.mock.calls[0][0].headers.authorization).toBe('Bearer token');
  });
  it('then the result is mapped to a user service request', async () => {
    const actual = await adapter.getApproversForService('org1', 'service1');

    expect(actual).not.toBeNull();
    expect(actual[0].id).toBe('123-afd');
    expect(actual[1].id).toBe('456-cdf');
  });
});
