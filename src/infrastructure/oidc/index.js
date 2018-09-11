/* eslint-disable no-param-reassign */
const config = require('../config');
const { Strategy, Issuer } = require('openid-client');
const logger = require('../logger');
const asyncRetry = require('login.dfe.async-retry');

const getPassportStrategy = async () => {
  Issuer.defaultHttpOptions = { timeout: 10000 };
  const issuer = await asyncRetry(async () => await Issuer.discover(config.identifyingParty.url), asyncRetry.strategies.apiStrategy);

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
