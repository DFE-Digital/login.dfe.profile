const config = require('./../config');
const KeepAliveAgent = require('agentkeepalive').HttpsAgent;
const rp = require('request-promise').defaults({
  agent: new KeepAliveAgent({
    maxSockets: config.hostingEnvironment.agentKeepAlive.maxSockets,
    maxFreeSockets: config.hostingEnvironment.agentKeepAlive.maxFreeSockets,
    timeout: config.hostingEnvironment.agentKeepAlive.timeout,
    keepAliveTimeout: config.hostingEnvironment.agentKeepAlive.keepAliveTimeout,
  }),
});
const jwtStrategy = require('login.dfe.jwt-strategies');

const createInvitation = async (firstName, lastName, email, clientId, redirectUri) => {
  const token = await jwtStrategy(config.directories.service).getBearerToken();
  const invitation = await rp({
    method: 'POST',
    uri: `${config.directories.service.url}/invitations`,
    headers: {
      authorization: `bearer ${token}`,
      'content-type': 'application/json',
    },
    body: {
      firstName,
      lastName,
      email,
      origin: {
        clientId,
        redirectUri,
      },
      selfStarted: true,
    },
    json: true,
  });
  return invitation.id;
};

const getInvitationById = async (id) => {
  const token = await jwtStrategy(config.directories.service).getBearerToken();
  try {
    const invitation = await rp({
      method: 'GET',
      uri: `${config.directories.service.url}/invitations/${id}`,
      headers: {
        authorization: `bearer ${token}`,
      },
      json: true,
    });
    return invitation;
  } catch (e) {
    if (e.statusCode === 404) {
      return undefined;
    }
    throw e;
  }
};

const convertInvitationToUser = async (id, password) => {
  const token = await jwtStrategy(config.directories.service).getBearerToken();
  try {
    const user = await rp({
      method: 'POST',
      uri: `${config.directories.service.url}/invitations/${id}/create_user`,
      headers: {
        'content-type': 'application/json',
        authorization: `bearer ${token}`,
      },
      body: {
        password,
      },
      json: true,
    });
    return user;
  } catch (e) {
    if (e.statusCode === 404) {
      return undefined;
    }
    throw e;
  }
};

module.exports = {
  createInvitation,
  getInvitationById,
  convertInvitationToUser,
};