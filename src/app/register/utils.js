const { getApplication } = require('./../../infrastructure/applications');
const config = require('./../../infrastructure/config');

const validateRP = async (req) => {
  const clientId = req.query.client_id ? req.query.client_id : config.hostingEnvironment.defaultRegisterService;
  const redirectUri = req.query.redirect_uri ? req.query.redirect_uri : config.hostingEnvironment.defaultRegisterServiceUrl;

  const client = await getApplication(clientId, req.id);
  if (!client || !client.relyingParty.redirect_uris.find(u => u.toLowerCase() === redirectUri.toLowerCase())) {
    return null;
  }

  return {
    clientId,
    redirectUri,
  };
};

module.exports = {
  validateRP,
};
