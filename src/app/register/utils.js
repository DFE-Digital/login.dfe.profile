const { getApplication } = require('./../../infrastructure/applications');

const validateRP = async (req) => {
  const clientId = req.query.client_id;
  const redirectUri = req.query.redirect_uri;

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
