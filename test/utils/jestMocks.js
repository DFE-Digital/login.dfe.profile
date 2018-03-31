'use strict';

const mockRequest = () => {
  return {
    params: {
      uuid: '123-abc',
    },
    session: {},
    body: {},
    query: {},
    csrfToken: jest.fn().mockReturnValue('token'),
  };
};
const mockResponse = () => {
  return {
    render: jest.fn(),
    redirect: jest.fn(),
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
  };
  return customConfig ? Object.assign(defaultConfig, customConfig) : defaultConfig;
};

module.exports = {
  mockRequest,
  mockResponse,
  mockConfig,
};
