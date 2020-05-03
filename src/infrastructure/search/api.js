const jwtStrategy = require('login.dfe.jwt-strategies');
const config = require('./../config');
const rp = require('login.dfe.request-promise-retry');

const callApi = async (endpoint, method, body, correlationId) => {
  const token = await jwtStrategy(config.search.service).getBearerToken();

  try {
    return await rp({
      method: method,
      uri: `${config.search.service.url}${endpoint}`,
      headers: {
        authorization: `bearer ${token}`,
        'x-correlation-id': correlationId,
      },
      body: body,
      json: true,
      strictSSL: config.hostingEnvironment.env.toLowerCase() !== 'dev',
    });
  } catch (e) {
    const status = e.statusCode ? e.statusCode : 500;
    if (status === 404 || e.statusCode === 400 || e.statusCode === 403) {
      return undefined;
    }
    throw e;
  }
};

const createIndex = async (id, correlationId) => {
  const body = {
    id,
  };
  await callApi('/users/update-index', 'POST', body, correlationId);
};

const deleteFromIndex = async (id, correlationId) => {
  await callApi(`/users/${id}`, 'DELETE', undefined, correlationId);
};

module.exports = {
  createIndex,
  deleteFromIndex,
};
