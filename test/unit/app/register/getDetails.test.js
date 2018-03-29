jest.mock('./../../../../src/app/register/utils');

const { validateRP } = require('./../../../../src/app/register/utils');
const getDetails = require('./../../../../src/app/register/getDetails');

const res = {
  render: jest.fn(),
  status: jest.fn(),
};

describe('when requesting user details for registration', () => {
  let req;

  beforeEach(() => {
    validateRP.mockReset().mockReturnValue({
      clientId: 'client1',
      redirectUri: 'https://relying.party',
    });

    req = {
      csrfToken: () => 'csrf-token',
      query: {
        client_id: 'client1',
        redirect_uri: 'https://relying.party',
      },
    };

    res.render.mockReset().mockReturnValue(res);
    res.status.mockReset().mockReturnValue(res);
  });

  it('then it should render details page', async () => {
    await getDetails(req, res);

    expect(res.render.mock.calls).toHaveLength(1);
    expect(res.render.mock.calls[0][0]).toBe('register/views/details');
  });

  it('then it should render model with csrf token', async () => {
    await getDetails(req, res);

    expect(res.render.mock.calls).toHaveLength(1);
    expect(res.render.mock.calls[0][1]).toMatchObject({
      csrfToken: 'csrf-token',
    });
  });

  it('then it should render model with blank properties', async () => {
    await getDetails(req, res);

    expect(res.render.mock.calls).toHaveLength(1);
    expect(res.render.mock.calls[0][1]).toMatchObject({
      firstName: '',
      lastName: '',
      email: '',
    });
  });

  it('then it should render model with empty validation messages', async () => {
    await getDetails(req, res);

    expect(res.render.mock.calls).toHaveLength(1);
    expect(res.render.mock.calls[0][1]).toMatchObject({
      validationMessages: {},
    });
  });


  it('then it should return 400 status if RP invalid', async () => {
    validateRP.mockReset().mockReturnValue(false);

    await getDetails(req, res);

    expect(res.status.mock.calls).toHaveLength(1);
    expect(res.status.mock.calls[0][0]).toBe(400);
  });

  it('then it should render invalid redirect uri view', async () => {
    validateRP.mockReset().mockReturnValue(false);

    await getDetails(req, res);

    expect(res.render.mock.calls).toHaveLength(1);
    expect(res.render.mock.calls[0][0]).toBe('register/views/invalidRedirectUri');
  });
});
