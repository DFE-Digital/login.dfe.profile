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

const hostingEnvironmentSchema = new SimpleSchema({
  defaultRegisterServiceUrl: patterns.url,
  defaultRegisterService: String,
});
hostingEnvironmentSchema.extend(schemas.hostingEnvironment);

const togglesSchema = new SimpleSchema({
  useSelfRegister: {
    type: Boolean,
    optional: true,
    defaultValue: false,
  },
});

const schema = new SimpleSchema({
  loggerSettings: schemas.loggerSettings,
  hostingEnvironment: hostingEnvironmentSchema,
  directories: schemas.apiClient,
  organisations: schemas.apiClient,
  access: schemas.apiClient,
  search: schemas.apiClient,
  applications: schemas.apiClient,
  identifyingParty: identifyingPartySchema,
  toggles: togglesSchema,
  assetSettings: schemas.assetSettings,
});

module.exports.validate = () => {
  validateConfigAgainstSchema(config, schema, logger);
};
