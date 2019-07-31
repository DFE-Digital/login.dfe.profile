jest.mock('./../../../../src/infrastructure/config', () => require('./../../../utils/jestMocks').mockConfig());

const { mockRequest, mockResponse } = require('./../../../utils/jestMocks');
const getResend = require('./../../../../src/app/register/getResend');

const res = mockResponse();

describe('when displaying the resend verification view', () => {
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
  });

  it('then it should return the confirm resend verification view', async () => {
    await getResend(req, res);

    expect(res.render.mock.calls.length).toBe(1);
    expect(res.render.mock.calls[0][0]).toBe('register/views/resend');
  });


  it('then it should include csrf token', async () => {
    await getResend(req, res);

    expect(res.render.mock.calls[0][1]).toMatchObject({
      csrfToken: 'csrf-token',
    });
  });

  it('then it should include the users email address', async () => {
    await getResend(req, res);

    expect(res.render.mock.calls[0][1]).toMatchObject({
      email: 'harry.potter@hogwarts.magic',
    });
  });

  it('then it should include the invitation id', async () => {
    await getResend(req, res);

    expect(res.render.mock.calls[0][1]).toMatchObject({
      invitationId: 'invitation-id',
    });
  });
});
