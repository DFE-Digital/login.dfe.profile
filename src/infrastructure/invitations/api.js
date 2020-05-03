const config = require('./../config');
const rp = require('login.dfe.request-promise-retry');
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
  return invitation ? invitation.id : undefined;
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

const getInvitationByEmail = async (email, correlationId) => {
  const token = await jwtStrategy(config.directories.service).getBearerToken();
  try {
    const invitation = await rp({
      method: 'GET',
      uri: `${config.directories.service.url}/invitations/by-email/${email}`,
      headers: {
        authorization: `bearer ${token}`,
        'x-correlation-id': correlationId,
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

const updateInvite = async (id, email, correlationId) => {
  const token = await jwtStrategy(config.directories.service).getBearerToken();
  try {
    const invitation = await rp({
      method: 'PATCH',
      uri: `${config.directories.service.url}/invitations/${id}`,
      headers: {
        authorization: `bearer ${token}`,
        'x-correlation-id': correlationId,
      },
      body: {
        email,
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

const resendInvitation = async (id, correlationId) => {
  const token = await jwtStrategy(config.directories.service).getBearerToken();
  try {
    const invitation = await rp({
      method: 'POST',
      uri: `${config.directories.service.url}/invitations/${id}/resend`,
      headers: {
        authorization: `bearer ${token}`,
        'x-correlation-id': correlationId,
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

module.exports = {
  createInvitation,
  getInvitationById,
  convertInvitationToUser,
  getInvitationByEmail,
  updateInvite,
  resendInvitation,
};
