'use strict';

const mockRequest = (customRequest) => {
  const defaultRequest = {
    id: 'correlation-id',
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
    flash: jest.fn(),
    mockResetAll: function () {
      this.render.mockReset().mockReturnValue(this);
      this.redirect.mockReset().mockReturnValue(this);
      this.status.mockReset().mockReturnValue(this);
      this.flash.mockReset();
    },
  };
};

const mockLogger = () => {
  return {
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    audit: jest.fn(),
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
    applications: {
      type: 'static',
    },
    organisations: {
      type: 'static',
    },
    access: {
      type: 'static',
    },
    search: {
      type: 'static',
    },
  };
  return Object.assign(defaultConfig, customConfig || {});
};

module.exports = {
  mockRequest,
  mockResponse,
  mockConfig,
  mockLogger,
};
