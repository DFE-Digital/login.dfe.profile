const { getOidcClientById } = require('./../../infrastructure/hotConfig');

const validateRP = async (req) => {
  const clientId = req.query.client_id;
  const redirectUri = req.query.redirect_uri;

  const client = await getOidcClientById(clientId);
  if (!client || !client.redirect_uris.find(u => u.toLowerCase() === redirectUri.toLowerCase())) {
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
