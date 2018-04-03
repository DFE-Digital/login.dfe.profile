jest.mock('./../../../../src/infrastructure/hotConfig');
jest.mock('./../../../../src/infrastructure/config', () => require('./../../../utils/jestMocks').mockConfig());

const { mockRequest } = require('./../../../utils/jestMocks');
const { getOidcClientById } = require('./../../../../src/infrastructure/hotConfig');
const { validateRP } = require('./../../../../src/app/register/utils');

describe('when validating a relying party for registration', () => {
  let req;

  beforeEach(() => {
    getOidcClientById.mockReset().mockReturnValue({
      client_id: 'client1',
      client_secret: 'some-secure-secret',
      redirect_uris: [
        'https://client.one/auth/cb',
        'https://client.one/register/complete',
      ],
      post_logout_redirect_uris: [
        'https://client.one/signout/complete',
      ],
    });

    req = mockRequest({
      query: {
        client_id: 'client1',
        redirect_uri: 'https://client.one/register/complete',
      },
    });
  });

  it('then it should return clientId and redirectUri if client found and has redirect', async () => {
    const actual = await validateRP(req);

    expect(actual).toEqual({
      clientId: 'client1',
      redirectUri: 'https://client.one/register/complete',
    });
  });

  it('then it should return null if client not found', async () => {
    getOidcClientById.mockReturnValue(null);

    const actual = await validateRP(req);

    expect(actual).toBeNull();
  });

  it('then it should return null if client found but does not have redirect', async () => {
    getOidcClientById.mockReturnValue({
      client_id: 'client1',
      client_secret: 'some-secure-secret',
      redirect_uris: [
        'https://client.one/auth/cb',
      ],
      post_logout_redirect_uris: [
        'https://client.one/signout/complete',
      ],
    });

    const actual = await validateRP(req);

    expect(actual).toBeNull();
  });
});
