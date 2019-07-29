jest.mock('./../../../../src/infrastructure/config', () => require('./../../../utils/jestMocks').mockConfig());
jest.mock('./../../../../src/infrastructure/account');

const { mockRequest, mockResponse } = require('./../../../utils/jestMocks');
const Account = require('./../../../../src/infrastructure/account');
const getVerifyEmail = require('./../../../../src/app/changeEmail/getVerifyEmail');

const res = mockResponse();
const getChangeEmailCode = jest.fn();

describe('when user coming to verify their new email address', () => {
  let req;

  beforeEach(() => {
    req = mockRequest({
      user: {
        sub: 'user1',
      },
    });

    res.mockResetAll();

    getChangeEmailCode.mockReset().mockReturnValue({
      code: '123XYZ',
      email: 'user.one@unit.test',
    });
    Account.fromContext.mockReset().mockReturnValue({
      getChangeEmailCode,
    });
    Account.getById.mockReset().mockReturnValue({
      getChangeEmailCode,
    });
  });

  it('then it should use account details from logged in user', async () => {
    await getVerifyEmail(req, res);

    expect(Account.fromContext.mock.calls).toHaveLength(1);
    expect(Account.fromContext.mock.calls[0][0]).toEqual({
      sub: 'user1',
    });
    expect(Account.getById.mock.calls).toHaveLength(0);
  });

  it('then it should use account details for user with uid in params when present', async () => {
    req.user = undefined;
    req.params.uid = 'user2';

    await getVerifyEmail(req, res);

    expect(Account.getById.mock.calls).toHaveLength(1);
    expect(Account.getById.mock.calls[0][0]).toEqual('user2');
    expect(Account.fromContext.mock.calls).toHaveLength(0);
  });

  it('then it should render view with email address from change email code', async () => {
    await getVerifyEmail(req, res);

    expect(res.render.mock.calls).toHaveLength(1);
    expect(res.render.mock.calls[0][0]).toBe('changeEmail/views/verifyEmailAddress');
    expect(res.render.mock.calls[0][1]).toEqual({
      currentPage: 'profile',
      backLink: true,
      csrfToken: 'csrf-token',
      newEmail: 'user.one@unit.test',
      code: '',
      validationMessages: {},
      includeResend: true,
    });
    expect(getChangeEmailCode.mock.calls).toHaveLength(1);
  });

  it('then it should render view with email address from change email code but exlude resend if user unauthenticated', async () => {
    req.user = undefined;
    req.params.uid = 'user2';

    await getVerifyEmail(req, res);

    expect(res.render.mock.calls).toHaveLength(1);
    expect(res.render.mock.calls[0][0]).toBe('changeEmail/views/verifyEmailAddress');
    expect(res.render.mock.calls[0][1]).toEqual({
      currentPage: 'profile',
      backLink: undefined,
      csrfToken: 'csrf-token',
      newEmail: 'user.one@unit.test',
      code: '',
      validationMessages: {},
      includeResend: false,
    });
    expect(getChangeEmailCode.mock.calls).toHaveLength(1);
  });

  it('then it should redirect to start of change email if no code found', async () => {
    getChangeEmailCode.mockReturnValue(null);

    await getVerifyEmail(req, res);

    expect(res.redirect.mock.calls).toHaveLength(1);
    expect(res.redirect.mock.calls[0][0]).toBe('/change-email');
    expect(getChangeEmailCode.mock.calls).toHaveLength(1);
  });
});
