const SimpleSchema = require('simpl-schema').default;
const { validateConfigAgainstSchema, schemas, patterns } = require('login.dfe.config.schema.common');
const config = require('./index');
const logger = require('./../logger');

const identifyingPartySchema = new SimpleSchema({
  url: patterns.url,
  clientId: String,
  clientSecret: String,
  clockTolerance: SimpleSchema.Integer,
});

const schema = new SimpleSchema({
  loggerSettings: schemas.loggerSettings,
  hostingEnvironment: schemas.hostingEnvironment,
  directories: schemas.apiClient,
  organisations: schemas.apiClient,
  hotConfig: schemas.apiClient,
  access: schemas.apiClient,
  search: schemas.apiClient,
  identifyingParty: identifyingPartySchema,
});

module.exports.validate = () => {
  validateConfigAgainstSchema(config, schema, logger);
};
