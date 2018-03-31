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
    },
    json: true,
  });
  return invitation.id;
};

module.exports = {
  createInvitation,
};