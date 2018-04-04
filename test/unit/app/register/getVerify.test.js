jest.mock('./../../../../src/infrastructure/config', () => require('./../../../utils/jestMocks').mockConfig());
jest.mock('./../../../../src/infrastructure/invitations');

const { getInvitationById } = require('./../../../../src/infrastructure/invitations');
const { mockRequest, mockResponse } = require('./../../../utils/jestMocks');
const getVerify = require('./../../../../src/app/register/getVerify');

const res = mockResponse();

describe('when processing verification code for registration', () => {
  let req;

  beforeEach(() => {
    req = mockRequest({
      params: {
        id: 'invitation-id',
      },
    });

    res.mockResetAll();

    getInvitationById.mockReset().mockReturnValue({
      firstName: 'User',
      lastName: 'One',
      email: 'user.one@unit.tests',
      origin: {
        clientId: 'client1',
        redirectUri: 'https://relying.party/auth/cb',
      },
      selfStarted: true,
      code: 'ABC123X',
      id: 'invitation-id',
    });
  });

  it('then it should render verify view', async () => {
    await getVerify(req, res);

    expect(res.render.mock.calls).toHaveLength(1);
    expect(res.render.mock.calls[0][0]).toBe('register/views/verify');
    expect(res.render.mock.calls[0][1]).toEqual({
      csrfToken: 'csrf-token',
      firstName: 'User',
      lastName: 'One',
      email: 'user.one@unit.tests',
      clientId: 'client1',
      redirectUri: 'https://relying.party/auth/cb',
      code: '',
      validationMessages: {},
    });
  });

  it('then it should render invitation not found view if invitation does not exist', async () => {
    getInvitationById.mockReturnValue(null);

    await getVerify(req, res);

    expect(res.render.mock.calls).toHaveLength(1);
    expect(res.render.mock.calls[0][0]).toBe('register/views/invitationNotFound');
  });
});
