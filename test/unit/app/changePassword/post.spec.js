jest.mock('./../../../../src/infrastructure/config', () => {
  return {
    directories: {
      type: 'static',
    },
    organisations: {
      type: 'static',
    },
    hostingEnvironment: {
    },
  };
});
jest.mock('./../../../../src/infrastructure/logger');
jest.mock('./../../../../src/infrastructure/account');
jest.mock('login.dfe.audit.winston-sequelize-transport');
jest.mock('login.dfe.validation');

const userId = 'User1';
const userEmail = 'user.one@unit.test';

describe('when processing a users request to change password', () => {

  let validatePassword;
  let setPassword;
  let req;
  let render;
  let flash;
  let redirect;
  let res;
  let action;
  let loggerAudit;
  let doesPasswordMeetPolicy;

  beforeEach(() => {
    validatePassword = jest.fn().mockReturnValue(true);

    setPassword = jest.fn();

    const Account = require('./../../../../src/infrastructure/account');
    Account.fromContext = jest.fn().mockImplementation(() => {
      return {
        id: userId,
        email: userEmail,
        validatePassword,
        setPassword,
      };
    });

    req = {
      csrfToken: () => {
        return 'token';
      },
      body: {
        oldPassword: 'password',
        newPassword: 'new-password',
        confirmPassword: 'new-password',
      },
    };

    render = jest.fn();
    flash = jest.fn();
    redirect = jest.fn();
    res = {
      render,
      flash,
      redirect,
    };

    loggerAudit = jest.fn();
    const logger = require('./../../../../src/infrastructure/logger');
    logger.audit = loggerAudit;

    doesPasswordMeetPolicy = jest.fn().mockReturnValue(true);
    const validation = require('login.dfe.validation');
    validation.passwordPolicy.doesPasswordMeetPolicy = doesPasswordMeetPolicy;

    action = require('./../../../../src/app/changePassword/post');
  });

  it('then it should return failed view if old password not entered', async () => {
    req.body.oldPassword = '';

    await action(req, res);

    expect(render.mock.calls.length).toBe(1);
    expect(render.mock.calls[0][0]).toBe('changePassword/views/change');
    expect(render.mock.calls[0][1]).toMatchObject({
      validationFailed: true,
      validationMessages: {
        oldPassword: 'Please enter your current password',
      },
    });
  });

  it('then it should return failed view if new password not entered', async () => {
    req.body.newPassword = '';

    await action(req, res);

    expect(render.mock.calls.length).toBe(1);
    expect(render.mock.calls[0][0]).toBe('changePassword/views/change');
    expect(render.mock.calls[0][1]).toMatchObject({
      validationFailed: true,
      validationMessages: {
        newPassword: 'Please enter a password',
      },
    });
  });

  it('then it should return failed view if confirm password not entered', async () => {
    req.body.confirmPassword = '';

    await action(req, res);

    expect(render.mock.calls.length).toBe(1);
    expect(render.mock.calls[0][0]).toBe('changePassword/views/change');
    expect(render.mock.calls[0][1]).toMatchObject({
      validationFailed: true,
      validationMessages: {
        confirmPassword: 'Please enter matching passwords',
      },
    });
  });

  it('then it should return failed view if confirm password does not match new password', async () => {
    req.body.newPassword = 'password1';
    req.body.confirmPassword = 'password2';

    await action(req, res);

    expect(render.mock.calls.length).toBe(1);
    expect(render.mock.calls[0][0]).toBe('changePassword/views/change');
    expect(render.mock.calls[0][1]).toMatchObject({
      validationFailed: true,
      validationMessages: {
        confirmPassword: 'Please enter matching passwords',
      },
    });
  });

  it('then it should return failed view if old password is not valid', async () => {
    validatePassword.mockReturnValue(false);

    await action(req, res);

    expect(render.mock.calls.length).toBe(1);
    expect(render.mock.calls[0][0]).toBe('changePassword/views/change');
    expect(render.mock.calls[0][1]).toMatchObject({
      validationFailed: true,
      validationMessages: {
        oldPassword: 'We do not recognise the password you entered. Please check and try again.',
      },
    });
  });

  it('then it should set user password if validation passes', async () => {
    await action(req, res);

    expect(setPassword.mock.calls.length).toBe(1);
    expect(setPassword.mock.calls[0][0]).toBe('new-password');
  });

  it('then it should set flash message if validation passes', async () => {
    await action(req, res);

    expect(flash.mock.calls.length).toBe(1);
    expect(flash.mock.calls[0][0]).toBe('info');
    expect(flash.mock.calls[0][1]).toBe('Your password has been changed');
  });

  it('then it should redirect to profile if validation passes', async () => {
    await action(req, res);

    expect(redirect.mock.calls.length).toBe(1);
    expect(redirect.mock.calls[0][0]).toBe('/');
  });

  it('then it should audit a successful change of password if validation passes', async () => {
    await action(req, res);

    expect(loggerAudit.mock.calls.length).toBe(1);
    expect(loggerAudit.mock.calls[0][0]).toBe(`Successfully changed password for ${userEmail} (id: ${userId})`);
    expect(loggerAudit.mock.calls[0][1]).toMatchObject({
      type: 'change-password',
      success: true,
      userId,
    });
  });

  it('then it should audit a failed change of password if old password is not valid', async () => {
    validatePassword.mockReturnValue(false);

    await action(req, res);

    expect(loggerAudit.mock.calls.length).toBe(1);
    expect(loggerAudit.mock.calls[0][0]).toBe(`Failed changed password for ${userEmail} (id: ${userId}) - Incorrect current password`);
    expect(loggerAudit.mock.calls[0][1]).toMatchObject({
      type: 'change-password',
      success: false,
      userId,
    });
  });

  it('then it should return failed view if new password does not meet policy', async () => {
    doesPasswordMeetPolicy.mockReturnValue(false);

    await action(req, res);

    expect(render.mock.calls.length).toBe(1);
    expect(render.mock.calls[0][0]).toBe('changePassword/views/change');
    expect(render.mock.calls[0][1]).toMatchObject({
      validationFailed: true,
      validationMessages: {
        newPassword: 'Please enter a password of at least 12 characters',
      },
    });
  });
});