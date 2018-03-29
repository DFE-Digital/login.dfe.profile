const validateRP = async (req) => {
  const clientId = req.query.client_id;
  const redirectUri = req.query.redirect_uri;

  // TODO: Check clientId + redirectUri against config
  let details;
  if (clientId && redirectUri) {
    details = {
      clientId,
      redirectUri,
    };
  }

  return Promise.resolve(details);
};

module.exports = {
  validateRP,
};
