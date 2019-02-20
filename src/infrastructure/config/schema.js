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

const accessIdentifiers = new SimpleSchema({
  identifiers: {
    type: Object,
  },
  'identifiers.service': patterns.uuid,
  'identifiers.organisation': patterns.uuid,
});

accessIdentifiers.extend(schemas.apiClient);

const hostingEnvironment = new SimpleSchema({
  manageUrl: {
    type: String,
    regEx: patterns.url,
    optional: true,
  },
});

hostingEnvironment.extend(schemas.hostingEnvironment);


const schema = new SimpleSchema({
  loggerSettings: schemas.loggerSettings,
  hostingEnvironment,
  identifyingParty: identifyingPartySchema,
  directories: schemas.apiClient,
  organisations: schemas.apiClient,
  access: accessIdentifiers,
  hotConfig: schemas.apiClient,
});

module.exports.validate = () => {
  validateConfigAgainstSchema(config, schema, logger);
};
