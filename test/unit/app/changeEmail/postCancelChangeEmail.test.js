jest.mock('./../../../../src/infrastructure/config', () => require('./../../../utils/jestMocks').mockConfig());
jest.mock('./../../../../src/infrastructure/account');

const { mockRequest, mockResponse } = require('./../../../utils/jestMocks');
const Account = require('./../../../../src/infrastructure/account');
const postCancelChangeEmail = require('./../../../../src/app/changeEmail/postCancelChangeEmail');

const res = mockResponse();
const deleteChangeEmailCode = jest.fn();


describe('when cancelling change of email', () => {
  let req;
  let accountStub;

  beforeEach(() => {
    req = mockRequest({
      user: {
        sub: 'user1',
      },
      body: {
        code: '123XYZ',
      },
    });

    res.mockResetAll();

    accountStub = {
      email: 'user1@unit.test',
      deleteChangeEmailCode,
    };
    Account.fromContext.mockReset().mockReturnValue(accountStub);
  });

  it('then it should delete change email code for user', async () => {
    await postCancelChangeEmail(req, res);

    expect(Account.fromContext.mock.calls).toHaveLength(1);
    expect(Account.fromContext.mock.calls[0][0]).toBe(req.user);
    expect(deleteChangeEmailCode.mock.calls).toHaveLength(1);
    expect(deleteChangeEmailCode.mock.calls[0][0]).toBe(req.id);
  });

  it('then it should redirect back to the profile page', async () => {
    await postCancelChangeEmail(req, res);

    expect(res.redirect.mock.calls).toHaveLength(1);
    expect(res.redirect.mock.calls[0][0]).toBe('/');
  });
});
