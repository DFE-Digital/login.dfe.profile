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
const { getInvitationById } = require('./../../../../src/infrastructure/invitations/api');

describe('when creating an invitation in directories api', () => {
  beforeEach(() => {
    rp.mockReset().mockReturnValue({
      firstName: 'User',
      lastName: 'One',
      email: 'user.one@unit.tests',
      origin: {
        clientId: 'client1',
        redirectUri: 'https://relying.party/auth/cb',
      },
      selfStarted: true,
      code: 'ABC123X',
      id: 'invitation-1',
    });

    jwtStrategy.mockReset().mockImplementation(() => ({
      getBearerToken: () => 'bearer-token',
    }));
  });

  it('then it should get invitation details from directories invitations resource', async () => {
    await getInvitationById('invitation-1');

    expect(rp.mock.calls).toHaveLength(1);
    expect(rp.mock.calls[0][0]).toMatchObject({
      method: 'GET',
      uri: 'https://directories.test/invitations/invitation-1',
      json: true,
    });
  });

  it('then it should return invitation from api if found', async () => {
    const actual = await getInvitationById('invitation-1');

    expect(actual).toEqual({
      firstName: 'User',
      lastName: 'One',
      email: 'user.one@unit.tests',
      origin: {
        clientId: 'client1',
        redirectUri: 'https://relying.party/auth/cb',
      },
      selfStarted: true,
      code: 'ABC123X',
      id: 'invitation-1',
    });
  });

  it('then it should return undefined if not found', async () => {
    rp.mockImplementation(() => {
      const e = new Error('not found');
      e.statusCode = 404;
      throw e;
    });

    const actual = await getInvitationById('invitation-1');

    expect(actual).toBeUndefined();
  });

  it('then it should authorize api call with bearer token', async () => {
    await getInvitationById('invitation-1');

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
      await getInvitationById('invitation-1');
      throw new Error('No error thrown');
    } catch (e) {
      expect(e.message).toBe('test');
    }
  });
});
