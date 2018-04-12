jest.mock('./../../../../src/infrastructure/config', () => require('./../../../utils/jestMocks').mockConfig());
jest.mock('./../../../../src/infrastructure/account');

const { mockRequest, mockResponse } = require('./../../../utils/jestMocks');
const Account = require('./../../../../src/infrastructure/account');
const postVerifyEmail = require('./../../../../src/app/changeEmail/postVerifyEmail');

const res = mockResponse();
const getChangeEmailCode = jest.fn();
const update = jest.fn();
const deleteChangeEmailCode = jest.fn();

describe('when user enters code to verify their new email address', () => {
  let req;
  let accountStub;

  beforeEach(() => {
    req = mockRequest({
      body: {
        code: '123XYZ',
      },
    });

    res.mockResetAll();

    getChangeEmailCode.mockReset().mockReturnValue({
      code: '123XYZ',
      newEmail: 'user.one@unit.test',
    });
    update.mockReset();

    accountStub = {
      email: 'user1@unit.test',
      getChangeEmailCode,
      update,
      deleteChangeEmailCode,
    };
    Account.fromContext.mockReset().mockReturnValue(accountStub);
  });

  it('then it should update users email address', async () => {
    await postVerifyEmail(req, res);

    expect(accountStub.email).toBe('user.one@unit.test');
    expect(update.mock.calls).toHaveLength(1);
    expect(update.mock.calls[0][0]).toBe('correlation-id');
  });

  it('then it should delete the users change email code', async () => {
    await postVerifyEmail(req, res);

    expect(deleteChangeEmailCode.mock.calls).toHaveLength(1);
    expect(deleteChangeEmailCode.mock.calls[0][0]).toBe('correlation-id');
  });

  it('then it should redirect to profile page', async () => {
    await postVerifyEmail(req, res);

    expect(res.redirect.mock.calls).toHaveLength(1);
    expect(res.redirect.mock.calls[0][0]).toBe('/');
    expect(getChangeEmailCode.mock.calls).toHaveLength(1);
  });

  it('then it should include flash message', async () => {
    await postVerifyEmail(req, res);

    expect(res.flash.mock.calls).toHaveLength(1);
    expect(res.flash.mock.calls[0][0]).toBe('info');
    expect(res.flash.mock.calls[0][1]).toBe('Your email address has been changed');
  });

  it('then it should redirect to start of change email if no code found', async () => {
    getChangeEmailCode.mockReturnValue(null);

    await postVerifyEmail(req, res);

    expect(res.redirect.mock.calls).toHaveLength(1);
    expect(res.redirect.mock.calls[0][0]).toBe('/change-email');
    expect(getChangeEmailCode.mock.calls).toHaveLength(1);
  });

  it('then it should render view with if codes not entered', async () => {
    req.body.code = undefined;

    await postVerifyEmail(req, res);

    expect(res.render.mock.calls).toHaveLength(1);
    expect(res.render.mock.calls[0][0]).toBe('changeEmail/views/verifyEmailAddress');
    expect(res.render.mock.calls[0][1]).toEqual({
      csrfToken: 'csrf-token',
      newEmail: 'user.one@unit.test',
      code: '',
      validationMessages: {
        code: 'Please enter verification code',
      },
    });
    expect(getChangeEmailCode.mock.calls).toHaveLength(1);
  });

  it('then it should render view with if codes do not match', async () => {
    req.body.code = 'ABC123';

    await postVerifyEmail(req, res);

    expect(res.render.mock.calls).toHaveLength(1);
    expect(res.render.mock.calls[0][0]).toBe('changeEmail/views/verifyEmailAddress');
    expect(res.render.mock.calls[0][1]).toEqual({
      csrfToken: 'csrf-token',
      newEmail: 'user.one@unit.test',
      code: 'ABC123',
      validationMessages: {
        code: 'Invalid code',
      },
    });
    expect(getChangeEmailCode.mock.calls).toHaveLength(1);
  });
});
