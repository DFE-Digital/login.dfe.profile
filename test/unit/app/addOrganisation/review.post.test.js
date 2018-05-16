jest.mock('./../../../../src/infrastructure/services', () => ({
  putUserInOrganisation: jest.fn(),
}));
jest.mock('./../../../../src/infrastructure/config', () => ({
  hostingEnvironment: {
    agentKeepAlive: {},
  },
}));
jest.mock('./../../../../src/infrastructure/logger');
jest.mock('login.dfe.audit.winston-sequelize-transport');

const { mockRequest, mockResponse } = require('./../../../utils/jestMocks');
const { putUserInOrganisation } = require('./../../../../src/infrastructure/services');
const { post } = require('./../../../../src/app/addOrganisation/review');

const res = mockResponse();


describe('when storing an organisation to a user', () => {
  const expectedOrgId = '5544887';
  const expectedUserId = '443322';
  const expectedUserEmail = 'test@local.com';
  let req;
  let loggerAudit;

  beforeEach(() => {
    req = mockRequest({
      user: {
        sub: expectedUserId,
        email: expectedUserEmail,
      },
      body: {
        organisationId: expectedOrgId,
        organisationName: 'Test School',
      },
      session: {
        organisationId: expectedOrgId,
      },
    });

    res.mockResetAll();

    loggerAudit = jest.fn();
    const logger = require('./../../../../src/infrastructure/logger');
    logger.audit = loggerAudit;
  });

  it('then it will store the organisation passed from the from against the user', async () => {
    await post(req, res);

    expect(putUserInOrganisation.mock.calls).toHaveLength(1);
    expect(putUserInOrganisation.mock.calls[0][0]).toBe(expectedOrgId);
    expect(putUserInOrganisation.mock.calls[0][1]).toBe(expectedUserId);
  });

  it('then it redirects to the profile page', async () => {
    await post(req, res);

    expect(res.redirect.mock.calls).toHaveLength(1);
    expect(res.redirect.mock.calls[0][0]).toBe('/');
  });

  it('then the session value is cleared for the organisation id', async () => {
    await post(req, res);

    expect(req.session.organisationId).toBe(undefined);
  });

  it('then a message is added to be displayed as a banner on the profile page', async () => {
    await post(req, res);

    expect(res.flash.mock.calls).toHaveLength(1);
    expect(res.flash.mock.calls[0][0]).toBe('info');
    expect(res.flash.mock.calls[0][1]).toBe('Your request for access to Test School has been submitted');
  });

  it('then the request to add an organisation to a user account is audited', async () => {
    await post(req, res);

    expect(loggerAudit.mock.calls).toHaveLength(1);
    expect(loggerAudit.mock.calls[0][0]).toBe(`Request made by user ${expectedUserEmail} to add organisation 'Test School' (id: ${expectedOrgId}) - To their user account`);
    expect(loggerAudit.mock.calls[0][1]).toMatchObject({
      type: 'user-add-organisation',
      success: true,
      userId: expectedUserId,
      reqId: req.id,
    });
  });
});
