/* eslint-disable global-require */
const config = require('./../config');

let adapter;
if (config.organisations.type.toLowerCase() === 'api') {
  adapter = require('./OrganisationsApiServicesAdapter');
} else {
  adapter = require('./StaticServicesAdapter');
}
module.exports = adapter;
