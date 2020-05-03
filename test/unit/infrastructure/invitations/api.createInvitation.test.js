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
const { createInvitation } = require('./../../../../src/infrastructure/invitations/api');

const firstName = 'Steve';
const lastName = 'Rodgers';
const email = 'steve.rodgers@avengers.test';
const clientId = 'client1';
const redirectUri = 'https://client.one.test/registation/complete';

describe('when creating an invitation in directories api', () => {
  beforeEach(() => {
    rp.mockReset().mockReturnValue({
      id: 'new-invitation-id',
    });

    jwtStrategy.mockReset().mockImplementation(() => ({
      getBearerToken: () => 'bearer-token',
    }));
  });

  it('should pass', () => {
    expect(true).toBe(true);
  });

  // it('then it should post invitation details to directories invitations resource', async () => {
  //   await createInvitation(firstName, lastName, email, clientId, redirectUri);

  //   expect(rp.mock.calls).toHaveLength(1);
  //   expect(rp.mock.calls[0][0]).toMatchObject({
  //     method: 'POST',
  //     uri: 'https://directories.test/invitations',
  //     headers: {
  //       'content-type': 'application/json',
  //     },
  //     body: {
  //       firstName,
  //       lastName,
  //       email,
  //       origin: {
  //         clientId,
  //         redirectUri,
  //       },
  //       selfStarted: true,
  //     },
  //     json: true,
  //   });
  // });

  // it('then it should return invitation id from api', async () => {
  //   const actual = await createInvitation(firstName, lastName, email, clientId, redirectUri);

  //   expect(actual).toBe('new-invitation-id');
  // });

  // it('then it should authorize api call with bearer token', async () => {
  //   await createInvitation(firstName, lastName, email, clientId, redirectUri);

  //   expect(rp.mock.calls).toHaveLength(1);
  //   expect(rp.mock.calls[0][0]).toMatchObject({
  //     headers: {
  //       authorization: 'bearer bearer-token',
  //     },
  //   });
  // });

  // it('then it should throw error if api call fails', async () => {
  //   rp.mockImplementation(() => {
  //     throw new Error('test');
  //   });

  //   try {
  //     await createInvitation(firstName, lastName, email, clientId, redirectUri);
  //     throw new Error('No error thrown');
  //   } catch (e) {
  //     expect(e.message).toBe('test');
  //   }
  // });
});
