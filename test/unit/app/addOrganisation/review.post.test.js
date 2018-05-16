jest.mock('./../../../../src/infrastructure/services', () => ({
  putUserInOrganisation: jest.fn(),
}));

const { mockRequest, mockResponse } = require('./../../../utils/jestMocks');
const { putUserInOrganisation } = require('./../../../../src/infrastructure/services');
const { post } = require('./../../../../src/app/addOrganisation/review');

const res = mockResponse();


describe('when storing an organisation to a user', () => {
  const expectedOrgId = '5544887';
  const expectedUserId = '443322';
  let req;

  beforeEach(() => {
    req = mockRequest({
      user: {
        sub: expectedUserId,
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
});
