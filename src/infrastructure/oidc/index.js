/* eslint-disable no-param-reassign */
const config = require('../config');
const { Strategy, Issuer } = require('openid-client');
const logger = require('../logger');

const getPassportStrategy = async () => {
  const issuer = await Issuer.discover(config.identifyingParty.url);
  Issuer.defaultHttpOptions = { timeout: 10000 };
  const client = new issuer.Client({
    client_id: config.identifyingParty.clientId,
    client_secret: config.identifyingParty.clientSecret,
  });
  if (config.identifyingParty.clockTolerance && config.identifyingParty.clockTolerance > 0) {
    client.CLOCK_TOLERANCE = config.identifyingParty.clockTolerance;
  }

  return new Strategy({
    client,
    params: { redirect_uri: `${config.hostingEnvironment.protocol}://${config.hostingEnvironment.host}:${config.hostingEnvironment.port}/auth/cb`, scope: 'openid profile email' },
  }, (tokenset, authUserInfo, done) => {
    done(null, { ...tokenset.claims, id_token: tokenset.id_token, id: tokenset.claims.sub, name: tokenset.sub });
  });
};


module.exports = getPassportStrategy;
