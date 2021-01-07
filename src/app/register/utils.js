const { markdown } = require('markdown');
const moment = require('moment');
const { getApplication, getServiceById, listAllBannersForService } = require('../../infrastructure/applications');
const config = require('../../infrastructure/config');

const getClientId = (req) => (req.query.client_id ? req.query.client_id : config.hostingEnvironment.defaultRegisterService);

const getRedirectUri = (req) => (req.query.redirect_uri ? req.query.redirect_uri : config.hostingEnvironment.defaultRegisterServiceUrl);

const convertMarkdownToHtml = (content) => markdown.toHTML(content);

const validateRP = async (req) => {
  const clientId = getClientId(req);
  const redirectUri = getRedirectUri(req);

  const client = await getApplication(clientId, req.id);
  if (!client || !client.relyingParty.redirect_uris.find((u) => u.toLowerCase() === redirectUri.toLowerCase())) {
    return null;
  }

  return {
    clientId,
    redirectUri,
  };
};

const getBannerDetails = async (req) => {
  const clientId = getClientId(req);

  const client = await getServiceById(clientId, req.id);
  if (!client || !client.id) {
    return null;
  }

  const allBannersForService = await listAllBannersForService(client.id, req.id);
  let header;
  let headerMessage;
  if (allBannersForService) {
    const now = moment();
    const timeLimitedBanner = allBannersForService.find((x) => moment(now).isBetween(x.validFrom, x.validTo) === true);
    const alwaysOnBanner = allBannersForService.find((x) => x.isActive === true);
    if (timeLimitedBanner) {
      header = timeLimitedBanner.title;
      headerMessage = convertMarkdownToHtml(timeLimitedBanner.message);
    } else if (alwaysOnBanner) {
      header = alwaysOnBanner.title;
      headerMessage = convertMarkdownToHtml(alwaysOnBanner.message);
    }
  }

  return {
    header,
    headerMessage,
  };
};

module.exports = {
  validateRP,
  getBannerDetails,
};
