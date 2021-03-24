const rp = require('login.dfe.request-promise-retry');
const jwtStrategy = require('login.dfe.jwt-strategies');
const config = require('../config');

const getApplication = async (idOrClientId, correlationId) => {
  const token = await jwtStrategy(config.applications.service).getBearerToken();
  try {
    return await rp({
      method: 'GET',
      uri: `${config.applications.service.url}/services/${idOrClientId}`,
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

const getServiceById = async (id, reqId) => {
  if (!id) {
    return undefined;
  }
  const token = await jwtStrategy(config.applications.service).getBearerToken();
  try {
    const client = await rp({
      method: 'GET',
      uri: `${config.applications.service.url}/services/${id}`,
      headers: {
        authorization: `bearer ${token}`,
        'x-correlation-id': reqId,
      },
      json: true,
    });
    return client;
  } catch (e) {
    if (e.statusCode === 404) {
      return undefined;
    }
    throw e;
  }
};

const listAllBannersForService = async (id, correlationId) => {
  const allBanners = [];

  let pageNumber = 1;
  let isMorePages = true;
  while (isMorePages) {
    const page = await getPageOfBanners(id, 25, pageNumber, correlationId);
    page.banners.forEach((banner) => {
      allBanners.push(banner);
    });
    pageNumber++;
    isMorePages = pageNumber <= page.totalNumberOfPages;
  }
  return allBanners;
};

const getPageOfBanners = async (id, pageSize, page, correlationId) => {
  if (!id) {
    return undefined;
  }
  const token = await jwtStrategy(config.applications.service).getBearerToken();
  try {
    return await rp({
      method: 'GET',
      uri: `${config.applications.service.url}/services/${id}/banners?pageSize=${pageSize}?&page=${page}`,
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

module.exports = {
  getApplication,
  getServiceById,
  listAllBannersForService,
};
