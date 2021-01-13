jest.mock('./../../../../src/infrastructure/applications');
jest.mock('./../../../../src/infrastructure/config', () => require('../../../utils/jestMocks').mockConfig());

const { markdown } = require('markdown');
const { mockRequest } = require('../../../utils/jestMocks');
const { getServiceById, listAllBannersForService } = require('../../../../src/infrastructure/applications');
const { getBannerDetails } = require('../../../../src/app/register/utils');

describe('when validating a relying party for registration', () => {
  let req;

  beforeEach(() => {
    getServiceById.mockReset().mockReturnValue({
      id: 'clientId'
    });

    listAllBannersForService.mockReset().mockReturnValue([{
      id: 'bannerId',
      serviceId: 'serviceId',
      name: 'banner name',
      title: 'Custom header message',
      message: 'New message',
      isActive: true,
    }]);

    req = mockRequest({
      query: {
        client_id: 'client1',
        redirect_uri: 'https://client.one/register/complete',
      },
    });
  });

  it('then it should return the configured banner messages', async () => {
    const actual = await getBannerDetails(req);

    expect(actual).toEqual({
      header: 'Custom header message',
      headerMessage: markdown.toHTML('New message'),
    });
  });

  it('then it should return empty object if client not found', async () => {
    getServiceById.mockReturnValue(null);

    const actual = await getBannerDetails(req);

    expect(actual).toEqual({});
  });

});
