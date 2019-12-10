const { mockRequest, mockResponse } = require('./../../../utils/jestMocks');

jest.mock('login.dfe.request-promise-retry');
jest.mock('login.dfe.jwt-strategies', () => () => ({
    getBearerToken: () => 'token',
}));
jest.mock('agentkeepalive', () => ({
    HttpsAgent: jest.fn(),
}));
jest.mock('./../../../../src/infrastructure/config', () => ({
    hostingEnvironment: {
        agentKeepAlive: {},
    },
    organisations: {
        service: {
            url: 'http://orgs.api.test',
        },
    },
}));

let adapter;

describe('when getting pending requests for approval', () => {
    let req;
    let res;
    let rp;

    beforeAll(() => {
        rp = jest.fn().mockReset().mockReturnValue(
            [{
                id: '123-afd',
                status: {
                    id: 0,
                    name: "Pending",
                }
            }, {
                id: '456-cdf',
            }],
        );
        const requestPromise = require('login.dfe.request-promise-retry');
        requestPromise.defaults.mockReturnValue(rp);
    });
    beforeEach(() => {
        req = mockRequest();
        res = mockResponse();

        adapter = require('./../../../../src/infrastructure/services/OrganisationsApiServicesAdapter');
    });
    it('then the bearer token for authorization is included', async () => {
        await adapter.getPendingRequestsForApproval('org1', 'service1');

        expect(rp.mock.calls[0][0].headers).not.toBeNull();
        expect(rp.mock.calls[0][0].headers.authorization).toBe('Bearer token');
    });
    it('then the result is mapped to the profile request', async () => {
        const actual = await adapter.getPendingRequestsForApproval('org1', 'service1');
        expect(actual).not.toBeNull();
        expect(actual[0].id).toBe('123-afd');
        expect(actual[0].status.id).toBe(0);
    });
});
