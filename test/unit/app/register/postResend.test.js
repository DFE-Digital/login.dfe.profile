jest.mock('./../../../../src/infrastructure/config', () => require('./../../../utils/jestMocks').mockConfig());
jest.mock('./../../../../src/infrastructure/invitations');
jest.mock('./../../../../src/infrastructure/logger', () => require('./../../../utils/jestMocks').mockLogger());

const { getInvitationById, resendInvitation, updateInvite } = require('./../../../../src/infrastructure/invitations');
const { mockRequest, mockResponse } = require('./../../../utils/jestMocks');
const postResend = require('./../../../../src/app/register/postResend');
const logger = require('./../../../../src/infrastructure/logger');

const res = mockResponse();

describe('when processing request to resend', () => {
  let req;

  beforeEach(() => {
    req = mockRequest({
      params: {
        id: 'invitation-id',
      },
      body: {
        email: 'harry.potter@hogwarts.magic',
      },
      session: {
        registration: {
          invitationId: 'invitation-id',
          firstName: 'Harry',
          lastName: 'Potter',
          email: 'harry.potter@hogwarts.magic',
          clientId: 'client2',
          redirectUri: 'https://some.rp.test/reg/complete',
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

    resendInvitation.mockReset();
    updateInvite.mockReset();
  });

  it('then it should return validation error if no email supplied', async () => {
    req.body.email = '';
    await postResend(req, res);

    expect(res.render.mock.calls).toHaveLength(1);
    expect(res.render.mock.calls[0][0]).toBe('register/views/resend');
    expect(res.render.mock.calls[0][1]).toEqual({
      backLink: true,
      csrfToken: 'csrf-token',
      email: '',
      existingEmail: 'harry.potter@hogwarts.magic',
      hideNav: true,
      invitationId: 'invitation-id',
      isExistingUser: false,
      noChangedEmail: false,
      title: 'Resend verification email - DfE Sign-in',
      validationMessages: {
        email: 'Enter an email address',
      },
    });
  });

  it('then it should render view if email not a valid email address', async () => {
    req.body.email = 'not-an-email';

    await postResend(req, res);

    expect(res.render.mock.calls).toHaveLength(1);
    expect(res.render.mock.calls[0][0]).toBe('register/views/resend');
    expect(res.render.mock.calls[0][1]).toEqual({
      backLink: true,
      csrfToken: 'csrf-token',
      email: 'not-an-email',
      existingEmail: 'harry.potter@hogwarts.magic',
      hideNav: true,
      invitationId: 'invitation-id',
      isExistingUser: false,
      noChangedEmail: false,
      title: 'Resend verification email - DfE Sign-in',
      validationMessages: {
        email: 'Enter a valid email address',
      },
    });
  });

  it('then it should resend invite if email not changed', async () => {
    await postResend(req, res);

    expect(resendInvitation.mock.calls).toHaveLength(1);
    expect(resendInvitation.mock.calls[0][0]).toBe('invitation-id');
    expect(resendInvitation.mock.calls[0][1]).toBe('correlation-id');
  });

  it('then it should update invite if email changed', async () => {
    req.body.email = 'john.doe@test.com';
    await postResend(req, res);

    expect(updateInvite.mock.calls).toHaveLength(1);
    expect(updateInvite.mock.calls[0][0]).toBe('invitation-id');
    expect(updateInvite.mock.calls[0][1]).toBe('john.doe@test.com');
    expect(updateInvite.mock.calls[0][2]).toBe('correlation-id');
  });

  it('then it should should audit resent invitation', async () => {
    await postResend(req, res);

    expect(logger.audit.mock.calls).toHaveLength(1);
    expect(logger.audit.mock.calls[0][0]).toBe('Resent invitation email to harry.potter@hogwarts.magic (id: invitation-id)');
    expect(logger.audit.mock.calls[0][1]).toMatchObject({
      type: 'resent-invitation',
      invitationId: 'invitation-id',
      invitedUserEmail: 'harry.potter@hogwarts.magic',
    });
  });

  it('then it should redirect to verify', async () => {
    await postResend(req, res);

    expect(res.redirect.mock.calls).toHaveLength(1);
    expect(res.redirect.mock.calls[0][0]).toBe('/register/invitation-id');
  });
});
