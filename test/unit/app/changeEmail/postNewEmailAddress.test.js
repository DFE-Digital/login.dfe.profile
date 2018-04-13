jest.mock('./../../../../src/infrastructure/config', () => require('./../../../utils/jestMocks').mockConfig());
jest.mock('./../../../../src/infrastructure/account');

const { mockRequest, mockResponse } = require('./../../../utils/jestMocks');
const Account = require('./../../../../src/infrastructure/account');
const postNewEmailAddress = require('./../../../../src/app/changeEmail/postNewEmailAddress');

const res = mockResponse();
const generateChangeEmailCode = jest.fn();

describe('when handing user entering new email address for change email', () => {
  let req;

  beforeEach(() => {
    req = mockRequest({
      body: {
        newEmail: 'user.one@unit.test',
      },
    });

    res.mockResetAll();

    generateChangeEmailCode.mockReset().mockReturnValue('123XYZ');
    Account.fromContext.mockReset().mockReturnValue({
      generateChangeEmailCode,
    });
    Account.getByEmail.mockReset().mockReturnValue(null);
  });

  it('then it should generate a new code for the change of email address', async () => {
    await postNewEmailAddress(req, res);

    expect(generateChangeEmailCode.mock.calls).toHaveLength(1);
    expect(generateChangeEmailCode.mock.calls[0][0]).toBe('user.one@unit.test');
    expect(generateChangeEmailCode.mock.calls[0][1]).toBe('correlation-id');
  });

  it('then it should redirect to verify', async () => {
    await postNewEmailAddress(req, res);

    expect(res.redirect.mock.calls).toHaveLength(1);
    expect(res.redirect.mock.calls[0][0]).toBe('/change-email/verify');
  });

  it('then it should render view with error if new email not entered', async () => {
    req.body.newEmail = undefined;

    await postNewEmailAddress(req, res);

    expect(res.render.mock.calls).toHaveLength(1);
    expect(res.render.mock.calls[0][0]).toBe('changeEmail/views/enterNewAddress');
    expect(res.render.mock.calls[0][1]).toEqual({
      backLink: true,
      csrfToken: 'csrf-token',
      newEmail: '',
      validationMessages: {
        newEmail: 'Please enter your new email address',
      },
      includeResend: true,
    });
  });

  it('then it should render view with error if new email not a valid email address', async () => {
    req.body.newEmail = 'not-an-email-address';

    await postNewEmailAddress(req, res);

    expect(res.render.mock.calls).toHaveLength(1);
    expect(res.render.mock.calls[0][0]).toBe('changeEmail/views/enterNewAddress');
    expect(res.render.mock.calls[0][1]).toEqual({
      backLink: true,
      csrfToken: 'csrf-token',
      newEmail: 'not-an-email-address',
      validationMessages: {
        newEmail: 'Please enter a valid new email address',
      },
      includeResend: true,
    });
  });

  it('then it should render view with error if new email already has an account', async () => {
    Account.getByEmail.mockReturnValue({});

    await postNewEmailAddress(req, res);

    expect(res.render.mock.calls).toHaveLength(1);
    expect(res.render.mock.calls[0][0]).toBe('changeEmail/views/enterNewAddress');
    expect(res.render.mock.calls[0][1]).toEqual({
      backLink: true,
      csrfToken: 'csrf-token',
      newEmail: 'user.one@unit.test',
      validationMessages: {
        newEmail: 'Email address is already associated to an account',
      },
      includeResend: true,
    });
  });
});
