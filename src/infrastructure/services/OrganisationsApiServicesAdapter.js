'use strict';

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

module.exports = {
  getServicesForUser,
  getAvailableServicesForUser,
  getServiceDetails,
  getServiceUsers,
  getUserServiceRequest,
  getApproversForService,
};
