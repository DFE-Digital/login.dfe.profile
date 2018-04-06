'use strict';

const mockRequest = (customRequest) => {
  const defaultRequest = {
    params: {
      uuid: '123-abc',
    },
    session: {},
    body: {},
    query: {},
    csrfToken: jest.fn().mockReturnValue('csrf-token'),
  };
  return Object.assign(defaultRequest, customRequest || {});
};
const mockResponse = () => {
  return {
    render: jest.fn(),
    redirect: jest.fn(),
    status: jest.fn(),
    mockResetAll: function () {
      this.render.mockReset().mockReturnValue(this);
      this.redirect.mockReset().mockReturnValue(this);
      this.status.mockReset().mockReturnValue(this);
    },
  };
};

const mockConfig = (customConfig) => {
  const defaultConfig = {
    hostingEnvironment: {
      agentKeepAlive: {},
    },
    directories: {
      type: 'static',
    },
    hotConfig: {
      type: 'static',
    },
    organisations: {
      type: 'static',
    },
  };
  return Object.assign(defaultConfig, customConfig || {});
};

module.exports = {
  mockRequest,
  mockResponse,
  mockConfig,
};
