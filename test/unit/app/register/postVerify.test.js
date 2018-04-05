jest.mock('./../../../../src/infrastructure/config', () => require('./../../../utils/jestMocks').mockConfig());
jest.mock('./../../../../src/infrastructure/invitations');
jest.mock('./../../../../src/infrastructure/account');

const { getInvitationById } = require('./../../../../src/infrastructure/invitations');
const { getByEmail } = require('./../../../../src/infrastructure/account');
const { mockRequest, mockResponse } = require('./../../../utils/jestMocks');
const postVerify = require('./../../../../src/app/register/postVerify');

const res = mockResponse();

describe('when processing verification code for registration', () => {
  let req;

  beforeEach(() => {
    req = mockRequest({
      params: {
        id: 'invitation-id',
      },
      body: {
        code: 'ABC123X',
      },
      session: {
        registration: {
          invitationId: 'invitation-one',
          firstName: 'Harry',
          lastName: 'Potter',
          email: 'harry.potter@hogwarts.magic',
        },
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

    getByEmail.mockReset().mockReturnValue(null);
  });

  it('then it should redirect to new password', async () => {
    await postVerify(req, res);

    expect(res.redirect.mock.calls).toHaveLength(1);
    expect(res.redirect.mock.calls[0][0]).toBe('/register/invitation-id/new-password');
  });

  it('then it should update session that code was verified', async () => {
    await postVerify(req, res);

    expect(req.session.registration).toMatchObject({
      invitationId: 'invitation-one',
      firstName: 'Harry',
      lastName: 'Potter',
      email: 'harry.potter@hogwarts.magic',
      codeVerified: true,
    });
  });

  it('then it should render view with error if code not entered', async () => {
    req.body.code = undefined;

    await postVerify(req, res);

    expect(res.render.mock.calls).toHaveLength(1);
    expect(res.render.mock.calls[0][0]).toBe('register/views/verify');
    expect(res.render.mock.calls[0][1]).toMatchObject({
      code: undefined,
      validationMessages: {
        code: 'Please enter code',
      },
    });
  });

  it('then it should render view with error if invitation does not exist', async () => {
    getInvitationById.mockReturnValue(null);

    await postVerify(req, res);

    expect(res.render.mock.calls).toHaveLength(1);
    expect(res.render.mock.calls[0][0]).toBe('register/views/verify');
    expect(res.render.mock.calls[0][1]).toMatchObject({
      code: 'ABC123X',
      validationMessages: {
        code: 'Failed to verify code',
      },
    });
  });

  it('then it should render view with error if entered code does not match invitation code', async () => {
    req.body.code = 'X321CBA';

    await postVerify(req, res);

    expect(res.render.mock.calls).toHaveLength(1);
    expect(res.render.mock.calls[0][0]).toBe('register/views/verify');
    expect(res.render.mock.calls[0][1]).toMatchObject({
      code: 'X321CBA',
      validationMessages: {
        code: 'Failed to verify code',
      },
    });
  });

  it('then it should redirect to email in use if invitation email already has an account', async () => {
    getByEmail.mockReturnValue({});

    await postVerify(req, res);

    expect(res.redirect.mock.calls).toHaveLength(1);
    expect(res.redirect.mock.calls[0][0]).toBe('/register/invitation-id/email-in-use');
    expect(getByEmail.mock.calls[0][0]).toBe('user.one@unit.tests');
  });
});
