jest.mock('request-promise');
jest.mock('login.dfe.jwt-strategies');
jest.mock('./../../../../../src/infrastructure/config', () => {
  return {
    directories: {
      service: {
        url: 'http://unit.test.local',
      },
    },
  };
});

describe('When setting a users password', () => {
  const user = { sub: 'user1', email: 'user.one@unit.test' };
  const password = 'new-password';

  let account;
  let getBearerToken;
  let rp;

  beforeEach(() => {
    getBearerToken = jest.fn().mockReturnValue('token');
    const jwtStrategy = require('login.dfe.jwt-strategies');
    jwtStrategy.mockImplementation(() => ({
      getBearerToken,
    }));

    rp = jest.fn();
    const requestPromise = require('request-promise');
    requestPromise.mockImplementation(rp);

    const Account = require('./../../../../../src/infrastructure/account/DirectoriesApiAccount');
    account = Account.fromContext(user);
  });

  it('then it should set users password in directories api', async () => {
    await account.setPassword(password);

    expect(rp.mock.calls).toHaveLength(1);
    expect(rp.mock.calls[0][0].method).toBe('POST');
    expect(rp.mock.calls[0][0].uri).toBe('http://unit.test.local/users/user1/changepassword');
    expect(rp.mock.calls[0][0].body).toMatchObject({
      password,
    });
  });

  it('then it should authorize api using jwt strategy', async () => {
    await account.setPassword(password);

    expect(getBearerToken.mock.calls).toHaveLength(1);
    expect(rp.mock.calls[0][0].headers.authorization).toBe('bearer token');
  });

  it('then it should return if password change successfully', async () => {
    await expect(account.setPassword(password)).resolves.toBeUndefined();
  });

  it('then it should reject if password change fails', async () => {
    rp.mockImplementation(() => {
      const error = new Error('Unit test');
      error.statusCode = 401;
      throw error;
    });

    await expect(account.setPassword(password)).rejects.toBeDefined();
  });
});
