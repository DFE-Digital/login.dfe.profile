const config = require('./../config');
const rp = require('login.dfe.request-promise-retry')
const jwtStrategy = require('login.dfe.jwt-strategies');

const getServicesForUser = async (id, correlationId) => {
  const token = await jwtStrategy(config.access.service).getBearerToken();

  try {
    return await rp({
      method: 'GET',
      uri: `${config.access.service.url}/users/${id}/services`,
      headers: {
        authorization: `bearer ${token}`,
        'x-correlation-id': correlationId,
      },
      json: true,
    });
  } catch (e) {
    if (e.statusCode === 404) {
      return undefined;
    }
    throw e;
  }
};

const migrateInvitationServicesToUserServices = async (invitationId, userId) => {
  try {
    const token = await jwtStrategy(config.access.service).getBearerToken();
    return await rp({
      method: 'POST',
      uri: `${config.access.service.url}/invitations/${invitationId}/migrate-to-user`,
      headers: {
        authorization: `Bearer ${token}`,
      },
      body: {
        userId,
      },
      json: true,
    });
  } catch (e) {
    if (e.statusCode === 404) {
      return null;
    }
    throw e;
  }
};

module.exports = {
  getServicesForUser,
  migrateInvitationServicesToUserServices,
};
