'use strict';

const KeepAliveAgent = require('agentkeepalive').HttpsAgent;
const Service = require('./Service');
const jwtStrategy = require('login.dfe.jwt-strategies');
const config = require('./../config');
const rp = require('request-promise').defaults({
  agent: new KeepAliveAgent({
    maxSockets: config.hostingEnvironment.agentKeepAlive.maxSockets,
    maxFreeSockets: config.hostingEnvironment.agentKeepAlive.maxFreeSockets,
    timeout: config.hostingEnvironment.agentKeepAlive.timeout,
    keepAliveTimeout: config.hostingEnvironment.agentKeepAlive.keepAliveTimeout,
  }),
});

const ServiceUser = require('./ServiceUser');
const UserServiceRequest = require('./UserServiceRequest');
const Organisation = require('./Organisation');

const getServicesForUser = async (userId) => {
  const token = await jwtStrategy(config.organisations.service).getBearerToken();
  const services = await rp({
    uri: `${config.organisations.service.url}/services/associated-with-user/${userId}`,
    headers: {
      authorization: `Bearer ${token}`,
    },
    json: true,
  });
  return services.map(item => new Service(item));
};

const getAvailableServicesForUser = async (userId) => {
  const token = await jwtStrategy(config.organisations.service).getBearerToken();
  const services = await rp({
    uri: `${config.organisations.service.url}/services/unassociated-with-user/${userId}`,
    headers: {
      authorization: `Bearer ${token}`,
    },
    json: true,
  });
  return services.map(item => new Service(item));
};

const getServiceDetails = async (organisationId, serviceId) => {
  const token = await jwtStrategy(config.organisations.service).getBearerToken();
  const service = await rp({
    uri: `${config.organisations.service.url}/organisations/${organisationId}/services/${serviceId}`,
    headers: {
      authorization: `Bearer ${token}`,
    },
    json: true,
  });
  return new Service(service);
};

const getServiceUsers = async (organisationId, serviceId) => {
  const token = await jwtStrategy(config.organisations.service).getBearerToken();
  const users = await rp({
    uri: `${config.organisations.service.url}/organisations/${organisationId}/services/${serviceId}/users`,
    headers: {
      authorization: `Bearer ${token}`,
    },
    json: true,
  });
  return users.map(item => new ServiceUser(item));
};

const getApproversForService = async (organisationId, serviceId) => {
  const token = await jwtStrategy(config.organisations.service).getBearerToken();

  const userIds = await rp({
    uri: `${config.organisations.service.url}/organisations/${organisationId}/services/${serviceId}/approvers`,
    headers: {
      authorization: `Bearer ${token}`,
    },
    json: true,
  });
  return userIds;
};

const getUserServiceRequest = async (organisationId, serviceId, userId) => {
  const token = await jwtStrategy(config.organisations.service).getBearerToken();
  const userServiceRequest = await rp({
    uri: `${config.organisations.service.url}/organisations/${organisationId}/services/${serviceId}/request/${userId}`,
    headers: {
      authorization: `Bearer ${token}`,
    },
    json: true,
  });

  return new UserServiceRequest(userServiceRequest);
};

const migrateInvitationServicesToUserServices = async (invitationId, userId) => {
  try {
    const token = await jwtStrategy(config.organisations.service).getBearerToken();

    return await rp({
      method: 'POST',
      uri: `${config.organisations.service.url}/invitations/${invitationId}/migrate-to-user`,
      headers: {
        authorization: `Bearer ${token}`,
      },
      body: {
        user_id: userId,
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

const searchOrganisations = async (criteria, page, filterCategories, filterStates) => {
  const token = await jwtStrategy(config.organisations.service).getBearerToken();

  let uri = `${config.organisations.service.url}/organisations?search=${criteria}&page=${page}`;
  if (filterCategories && filterCategories.length > 0) {
    uri += `&filtercategory=${filterCategories.join('&filtercategory=')}`;
  }
  if (filterStates && filterStates.length > 0) {
    uri += `&filterstatus=${filterStates.join('&filterstatus=')}`;
  }

  const results = await rp({
    uri,
    headers: {
      authorization: `Bearer ${token}`,
    },
    json: true,
  });

  const organisations = results.organisations.map(o => new Organisation(o));

  return {
    organisations,
    page: results.page,
    totalNumberOfPages: results.totalNumberOfPages,
    totalNumberOfRecords: results.totalNumberOfRecords,
  };
};

const getOrganisationCategories = async () => {
  const token = await jwtStrategy(config.organisations.service).getBearerToken();
  const results = await rp({
    uri: `${config.organisations.service.url}/organisations/categories`,
    headers: {
      authorization: `Bearer ${token}`,
    },
    json: true,
  });

  return results;
};

const getOrganisationStates = async () => {
  const token = await jwtStrategy(config.organisations.service).getBearerToken();
  const results = await rp({
    uri: `${config.organisations.service.url}/organisations/states`,
    headers: {
      authorization: `Bearer ${token}`,
    },
    json: true,
  });

  return results;
};

const getOrganisation = async (orgId) => {
  const token = await jwtStrategy(config.organisations.service).getBearerToken();

  return await rp({
    uri: `${config.organisations.service.url}/organisations/${orgId}`,
    headers: {
      authorization: `Bearer ${token}`,
    },
    json: true,
  });
};

module.exports = {
  getServicesForUser,
  getAvailableServicesForUser,
  getServiceDetails,
  getServiceUsers,
  getUserServiceRequest,
  getApproversForService,
  migrateInvitationServicesToUserServices,
  searchOrganisations,
  getOrganisationCategories,
  getOrganisationStates,
  getOrganisation,
};
