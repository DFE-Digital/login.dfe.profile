jest.mock('login.dfe.request-promise-retry');
jest.mock('login.dfe.jwt-strategies');
jest.mock('agentkeepalive', () => ({
  HttpsAgent: jest.fn(),
}));
jest.mock('./../../../../../src/infrastructure/config', () => {
  return {
    hostingEnvironment: {
      agentKeepAlive: {},
    },
    directories: {
      service: {
        url: 'http://unit.test.local',
      },
    },
  };
});
const requestPromise = require('login.dfe.request-promise-retry');
describe('When validating a users password', () => {
  const user = { email: 'user.one@unit.test' };
  const password = 'password';

  let account;
  let getBearerToken;
  let rp;

  beforeAll(() => {
    rp = jest.fn();
    requestPromise.defaults.mockReturnValue(rp);
  });
  beforeEach(() => {
    getBearerToken = jest.fn().mockReturnValue('token');
    const jwtStrategy = require('login.dfe.jwt-strategies');
    jwtStrategy.mockImplementation(() => ({
      getBearerToken,
    }));


    const Account = require('./../../../../../src/infrastructure/account/DirectoriesApiAccount');
    account = Account.fromContext(user);
  });

  it('then it should authenticate user against directories api', async () => {
    await account.validatePassword(password);

    expect(rp.mock.calls).toHaveLength(1);
    expect(rp.mock.calls[0][0].method).toBe('POST');
    expect(rp.mock.calls[0][0].uri).toBe('http://unit.test.local/users/authenticate');
    expect(rp.mock.calls[0][0].body).toMatchObject({
      username: user.email,
      password,
    });
  });

  it('then it should authorize api using jwt strategy', async () => {
    await account.validatePassword(password);

    expect(getBearerToken.mock.calls).toHaveLength(1);
    expect(rp.mock.calls[0][0].headers.authorization).toBe('bearer token');
  });

  it('then it should return true is password is valid', async () => {
    const result = await account.validatePassword(password);

    expect(result).toBe(true);
  });

  it('then it should return false when api returns error', async () => {
    rp.mockImplementation(() => {
      const error = new Error('Unit test');
      error.statusCode = 401;
      throw error;
    });

    const result = await account.validatePassword(password);

    expect(result).toBe(false);
  });
});
