jest.mock('./../../../../src/infrastructure/config', () => require('./../../../utils/jestMocks').mockConfig({
  directories: {
    type: 'api',
    service: {
      url: 'https://directories.test',
    },
  },
}));
jest.mock('login.dfe.request-promise-retry');
jest.mock('login.dfe.jwt-strategies');
jest.mock('agentkeepalive', () => ({
  HttpsAgent: jest.fn(),
}));

const requestPromise = require('login.dfe.request-promise-retry');
const rp = jest.fn();
requestPromise.defaults.mockReturnValue(rp);
const jwtStrategy = require('login.dfe.jwt-strategies');
const { convertInvitationToUser } = require('./../../../../src/infrastructure/invitations/api');

const firstName = 'Steve';
const lastName = 'Rodgers';
const email = 'steve.rodgers@avengers.test';
const clientId = 'client1';
const redirectUri = 'https://client.one.test/registation/complete';

describe('when creating an invitation in directories api', () => {
  beforeEach(() => {
    rp.mockReset().mockReturnValue({
      id: 'new-user-id',
      given_name: 'New',
      family_name: 'User',
      email: 'new.user@unit.tests',
    });

    jwtStrategy.mockReset().mockImplementation(() => ({
      getBearerToken: () => 'bearer-token',
    }));
  });

  it('then it should post password to directories invitations create user resource', async () => {
    await convertInvitationToUser('invitation-id', 'password1234');

    expect(rp.mock.calls).toHaveLength(1);
    expect(rp.mock.calls[0][0]).toMatchObject({
      method: 'POST',
      uri: 'https://directories.test/invitations/invitation-id/create_user',
      headers: {
        'content-type': 'application/json',
      },
      body: {
        password: 'password1234',
      },
      json: true,
    });
  });

  it('then it should return user from api', async () => {
    const actual = await convertInvitationToUser(firstName, lastName, email, clientId, redirectUri);

    expect(actual).toEqual({
      id: 'new-user-id',
      given_name: 'New',
      family_name: 'User',
      email: 'new.user@unit.tests',
    });
  });

  it('then it should authorize api call with bearer token', async () => {
    await convertInvitationToUser('invitation-id', 'password1234');

    expect(rp.mock.calls).toHaveLength(1);
    expect(rp.mock.calls[0][0]).toMatchObject({
      headers: {
        authorization: 'bearer bearer-token',
      },
    });
  });

  it('then it should throw error if api call fails', async () => {
    rp.mockImplementation(() => {
      throw new Error('test');
    });

    try {
      await convertInvitationToUser('invitation-id', 'password1234');
      throw new Error('No error thrown');
    } catch (e) {
      expect(e.message).toBe('test');
    }
  });
});
