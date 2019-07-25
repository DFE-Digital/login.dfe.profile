jest.mock('./../../../../src/app/register/utils');
jest.mock('email-validator');
jest.mock('./../../../../src/infrastructure/invitations');
jest.mock('./../../../../src/infrastructure/config', () => require('./../../../utils/jestMocks').mockConfig());
jest.mock('uuid/v4');

const { mockRequest, mockResponse } = require('./../../../utils/jestMocks');
const { validateRP } = require('./../../../../src/app/register/utils');
const emailValidator = require('email-validator');
const { createInvitation } = require('./../../../../src/infrastructure/invitations');
const uuid = require('uuid/v4');
const postDetails = require('./../../../../src/app/register/postDetails');

const res = mockResponse();

describe('when processing user details for registration', () => {
  let req;

  beforeEach(() => {
    validateRP.mockReset().mockReturnValue({
      clientId: 'client1',
      redirectUri: 'https://relying.party',
    });

    emailValidator.validate.mockReset().mockReturnValue(true);

    createInvitation.mockReset().mockReturnValue('invitation-one');

    uuid.mockReset().mockReturnValue('00000000-0000-0000-0000-000000000000');

    req = mockRequest({
      query: {
        client_id: 'client1',
        redirect_uri: 'https://relying.party',
      },
      body: {
        firstName: 'Harry',
        lastName: 'Potter',
        email: 'harry.potter@hogwarts.magic',
      },
    });

    res.mockResetAll();
  });

  it('then it should create invitation record', async () => {
    await postDetails(req, res);

    expect(createInvitation.mock.calls).toHaveLength(1);
    expect(createInvitation.mock.calls[0][0]).toBe(req.body.firstName);
    expect(createInvitation.mock.calls[0][1]).toBe(req.body.lastName);
    expect(createInvitation.mock.calls[0][2]).toBe(req.body.email);
  });

  it('then it should redirect to verification page', async () => {
    await postDetails(req, res);

    expect(res.redirect.mock.calls).toHaveLength(1);
    expect(res.redirect.mock.calls[0][0]).toBe('/register/invitation-one');
  });

  it('then it should render details page if input invalid', async () => {
    emailValidator.validate.mockReturnValue(false);

    await postDetails(req, res);

    expect(res.render.mock.calls).toHaveLength(1);
    expect(res.render.mock.calls[0][0]).toBe('register/views/details');
  });

  it('then it should render model with csrf token if input invalid', async () => {
    emailValidator.validate.mockReturnValue(false);

    await postDetails(req, res);

    expect(res.render.mock.calls).toHaveLength(1);
    expect(res.render.mock.calls[0][1]).toMatchObject({
      csrfToken: 'csrf-token',
    });
  });

  it('then it should render model with posted properties if input invalid', async () => {
    emailValidator.validate.mockReturnValue(false);

    await postDetails(req, res);

    expect(res.render.mock.calls).toHaveLength(1);
    expect(res.render.mock.calls[0][1]).toMatchObject({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
    });
  });

  it('then it should render model with validation message if first name not entered', async () => {
    req.body.firstName = undefined;

    await postDetails(req, res);

    expect(res.render.mock.calls).toHaveLength(1);
    expect(res.render.mock.calls[0][1]).toMatchObject({
      validationMessages: {
        firstName: 'Enter a first name',
      },
    });
  });

  it('then it should render model with validation message if last name not entered', async () => {
    req.body.lastName = undefined;

    await postDetails(req, res);

    expect(res.render.mock.calls).toHaveLength(1);
    expect(res.render.mock.calls[0][1]).toMatchObject({
      validationMessages: {
        lastName: 'Enter a last name',
      },
    });
  });

  it('then it should render model with validation message if email address not entered', async () => {
    req.body.email = undefined;

    await postDetails(req, res);

    expect(res.render.mock.calls).toHaveLength(1);
    expect(res.render.mock.calls[0][1]).toMatchObject({
      validationMessages: {
        email: 'Enter an email address',
      },
    });
  });

  it('then it should render model with validation message if email address not valid', async () => {
    emailValidator.validate.mockReturnValue(false);

    await postDetails(req, res);

    expect(res.render.mock.calls).toHaveLength(1);
    expect(res.render.mock.calls[0][1]).toMatchObject({
      validationMessages: {
        email: 'Enter a valid email address',
      },
    });
  });

  it('then it should use sudo invitation id if account already exists', async () => {
    createInvitation.mockReturnValue(undefined);

    await postDetails(req, res);

    expect(res.redirect.mock.calls).toHaveLength(1);
    expect(res.redirect.mock.calls[0][0]).toBe('/register/00000000-0000-0000-0000-000000000000');
  });

  it('then it should store invitation id and entered details in session', async () => {
    await postDetails(req, res);

    expect(req.session.registration).toEqual({
      invitationId: 'invitation-one',
      firstName: 'Harry',
      lastName: 'Potter',
      email: 'harry.potter@hogwarts.magic',
      clientId: 'client1',
      redirectUri: 'https://relying.party',
    });
  });


  it('then it should return 400 status if RP invalid', async () => {
    validateRP.mockReset().mockReturnValue(false);

    await postDetails(req, res);

    expect(res.status.mock.calls).toHaveLength(1);
    expect(res.status.mock.calls[0][0]).toBe(400);
  });

  it('then it should render invalid redirect uri view', async () => {
    validateRP.mockReset().mockReturnValue(false);

    await postDetails(req, res);

    expect(res.render.mock.calls).toHaveLength(1);
    expect(res.render.mock.calls[0][0]).toBe('register/views/invalidRedirectUri');
  });
});
