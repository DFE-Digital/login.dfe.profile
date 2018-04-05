jest.mock('./../../../../src/infrastructure/config', () => require('./../../../utils/jestMocks').mockConfig());
jest.mock('./../../../../src/infrastructure/invitations');

const { getInvitationById, createInvitation } = require('./../../../../src/infrastructure/invitations');
const { mockRequest, mockResponse } = require('./../../../utils/jestMocks');
const postResend = require('./../../../../src/app/register/postResend');

const res = mockResponse();

describe('when processing request to resend', () => {
  let req;

  beforeEach(() => {
    req = mockRequest({
      params: {
        id: 'invitation-id',
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

    createInvitation.mockReset();
  });

  it('then it should re-create invitation using session if available and invitation ids match', async () => {
    await postResend(req, res);

    expect(createInvitation.mock.calls).toHaveLength(1);
    expect(createInvitation.mock.calls[0][0]).toBe('Harry');
    expect(createInvitation.mock.calls[0][1]).toBe('Potter');
    expect(createInvitation.mock.calls[0][2]).toBe('harry.potter@hogwarts.magic');
    expect(createInvitation.mock.calls[0][3]).toBe('client2');
    expect(createInvitation.mock.calls[0][4]).toBe('https://some.rp.test/reg/complete');

    expect(res.redirect.mock.calls).toHaveLength(1);
    expect(res.redirect.mock.calls[0][0]).toBe('/register/invitation-id');
  });

  it('then it should re-create invitation using invitation details session available but invitation ids dont match', async () => {
    req.session.registration.invitationId = 'some-other-id';

    await postResend(req, res);

    expect(createInvitation.mock.calls).toHaveLength(1);
    expect(createInvitation.mock.calls[0][0]).toBe('User');
    expect(createInvitation.mock.calls[0][1]).toBe('One');
    expect(createInvitation.mock.calls[0][2]).toBe('user.one@unit.tests');
    expect(createInvitation.mock.calls[0][3]).toBe('client1');
    expect(createInvitation.mock.calls[0][4]).toBe('https://relying.party/auth/cb');

    expect(res.redirect.mock.calls).toHaveLength(1);
    expect(res.redirect.mock.calls[0][0]).toBe('/register/invitation-id');
  });

  it('then it should re-create invitation using invitation details session not available', async () => {
    req.session.registration = undefined;

    await postResend(req, res);

    expect(createInvitation.mock.calls).toHaveLength(1);
    expect(createInvitation.mock.calls[0][0]).toBe('User');
    expect(createInvitation.mock.calls[0][1]).toBe('One');
    expect(createInvitation.mock.calls[0][2]).toBe('user.one@unit.tests');
    expect(createInvitation.mock.calls[0][3]).toBe('client1');
    expect(createInvitation.mock.calls[0][4]).toBe('https://relying.party/auth/cb');

    expect(res.redirect.mock.calls).toHaveLength(1);
    expect(res.redirect.mock.calls[0][0]).toBe('/register/invitation-id');
  });

  it('then it should re-create invitation if session available but invitation is not', async () => {
    req.session.registration.invitationId = 'some-other-id';
    getInvitationById.mockReturnValue(null);

    await postResend(req, res);

    expect(createInvitation.mock.calls).toHaveLength(0);

    expect(res.redirect.mock.calls).toHaveLength(1);
    expect(res.redirect.mock.calls[0][0]).toBe('/register/invitation-id');
  });

  it('then it should re-create invitation if neither session not invitation available', async () => {
    req.session.registration = undefined;
    getInvitationById.mockReturnValue(null);

    await postResend(req, res);

    expect(createInvitation.mock.calls).toHaveLength(0);

    expect(res.redirect.mock.calls).toHaveLength(1);
    expect(res.redirect.mock.calls[0][0]).toBe('/register/invitation-id');
  });
});
