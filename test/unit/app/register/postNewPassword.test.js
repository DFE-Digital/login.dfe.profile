jest.mock('./../../../../src/infrastructure/config', () => require('./../../../utils/jestMocks').mockConfig());
jest.mock('./../../../../src/infrastructure/invitations');

const { mockRequest, mockResponse } = require('./../../../utils/jestMocks');
const { getInvitationById, convertInvitationToUser } = require('./../../../../src/infrastructure/invitations');
const postNewPassword = require('./../../../../src/app/register/postNewPassword');

const res = mockResponse();

describe('when handling confirmation of new password in registration', () => {
  let req;

  beforeEach(() => {
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

    convertInvitationToUser.mockReset().mockReturnValue({
      id: 'new-user-id',
    });

    req = mockRequest({
      params: {
        id: 'invitation-id',
      },
      body: {
        newPassword: 'password1234',
        confirmPassword: 'password1234',
      },
      session: {
        registration: {
          codeVerified: true,
        },
      },
    });

    res.mockResetAll();
  });

  it('it should convert invitation to user', async () => {
    await postNewPassword(req, res);

    expect(convertInvitationToUser.mock.calls).toHaveLength(1);
    expect(convertInvitationToUser.mock.calls[0][0]).toBe('invitation-id');
    expect(convertInvitationToUser.mock.calls[0][1]).toBe('password1234');
  });

  it('then it should update session with user id', async () => {
    await postNewPassword(req, res);

    expect(req.session.registration.userId).toBe('new-user-id');
  });

  it('then it should redirect to complete view', async () => {
    await postNewPassword(req, res);

    expect(res.redirect.mock.calls).toHaveLength(1);
    expect(res.redirect.mock.calls[0][0]).toBe('/register/invitation-id/complete');
  });


  it('then it should render invitation not found view if cannot find invitation', async () => {
    getInvitationById.mockReturnValue(null);

    await postNewPassword(req, res);

    expect(res.render.mock.calls).toHaveLength(1);
    expect(res.render.mock.calls[0][0]).toBe('register/views/invitationNotFound');
  });

  it('then it should redirect to verify if code not verified', async () => {
    req.session.registration = undefined;

    await postNewPassword(req, res);

    expect(res.redirect.mock.calls).toHaveLength(1);
    expect(res.redirect.mock.calls[0][0]).toBe('/register/invitation-id');
  });

  it('then it should return view with error if new password not entered', async () => {
    req.body.newPassword = undefined;

    await postNewPassword(req, res);

    expect(res.render.mock.calls).toHaveLength(1);
    expect(res.render.mock.calls[0][0]).toBe('register/views/newPassword');
    expect(res.render.mock.calls[0][1]).toMatchObject({
      validationMessages: {
        newPassword: 'Please enter new password',
      },
    });
  });

  it('then it should return view with error if new password shorter than 12 characters', async () => {
    req.body.newPassword = 'abc';

    await postNewPassword(req, res);

    expect(res.render.mock.calls).toHaveLength(1);
    expect(res.render.mock.calls[0][0]).toBe('register/views/newPassword');
    expect(res.render.mock.calls[0][1]).toMatchObject({
      validationMessages: {
        newPassword: 'Please enter new password that is at least 12 characters long',
      },
    });
  });

  it('then it should return view with error if confirm password not entered', async () => {
    req.body.confirmPassword = undefined;

    await postNewPassword(req, res);

    expect(res.render.mock.calls).toHaveLength(1);
    expect(res.render.mock.calls[0][0]).toBe('register/views/newPassword');
    expect(res.render.mock.calls[0][1]).toMatchObject({
      validationMessages: {
        confirmPassword: 'Please enter confirm password',
      },
    });
  });

  it('then it should return view with error if confirm password shorter than 12 characters', async () => {
    req.body.confirmPassword = 'abc';

    await postNewPassword(req, res);

    expect(res.render.mock.calls).toHaveLength(1);
    expect(res.render.mock.calls[0][0]).toBe('register/views/newPassword');
    expect(res.render.mock.calls[0][1]).toMatchObject({
      validationMessages: {
        confirmPassword: 'Please enter confirm password that is at least 12 characters long',
      },
    });
  });

  it('then it should return view with error if confirm password does not match new password', async () => {
    req.body.confirmPassword = 'fhfhjinewicnidsffnsifd';

    await postNewPassword(req, res);

    expect(res.render.mock.calls).toHaveLength(1);
    expect(res.render.mock.calls[0][0]).toBe('register/views/newPassword');
    expect(res.render.mock.calls[0][1]).toMatchObject({
      validationMessages: {
        confirmPassword: 'Passwords must match',
      },
    });
  });
});
