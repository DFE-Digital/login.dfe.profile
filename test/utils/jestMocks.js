'use strict';

const mockRequest = () => {
  return {
    params: {
      uuid: '123-abc',
    },
    session: {
    },
    body: {
    },
    query: {
    },
    csrfToken: jest.fn().mockReturnValue('token'),
  };
};
const mockResponse = () => {
  return {
    render: jest.fn(),
    redirect: jest.fn(),
  };
};

module.exports = {
  mockRequest,
  mockResponse
};
