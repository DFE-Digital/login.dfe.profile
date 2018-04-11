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
    req = mockRequest();

    res.mockResetAll();

    getChangeEmailCode.mockReset().mockReturnValue({
      code: '123XYZ',
      newEmail: 'user.one@unit.test',
    });
    Account.fromContext.mockReset().mockReturnValue({
      getChangeEmailCode,
    });
  });

  it('then it should render view with email address from change email code', async () => {
    await getVerifyEmail(req, res);

    expect(res.render.mock.calls).toHaveLength(1);
    expect(res.render.mock.calls[0][0]).toBe('changeEmail/views/verifyEmailAddress');
    expect(res.render.mock.calls[0][1]).toEqual({
      csrfToken: 'csrf-token',
      newEmail: 'user.one@unit.test',
      code: '',
      validationMessages: {},
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
