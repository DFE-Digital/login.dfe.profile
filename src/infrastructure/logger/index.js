'use strict';

// eslint-disable-next-line no-unused-expressions
require('winston-redis').Redis;
const winston = require('winston');
const config = require('./../config');
const WinstonSequelizeTransport = require('login.dfe.audit.winston-sequelize-transport');
const appInsights = require('applicationinsights');
const WinstonApplicationInsights = require('winston-azure-application-insights').AzureApplicationInsightsLogger;

const logLevel = (config && config.loggerSettings && config.loggerSettings.logLevel) ? config.loggerSettings.logLevel : 'info';

const loggerConfig = {
  levels: {
    audit: 0,
    error: 1,
    warn: 2,
    info: 3,
    verbose: 4,
    debug: 5,
    silly: 6,
  },
  colors: {
    info: 'yellow',
    ok: 'green',
    error: 'red',
    audit: 'magenta',
  },
  transports: [],
};

loggerConfig.transports.push(new (winston.transports.Console)({ level: logLevel, colorize: true }));
if (config && config.loggerSettings && config.loggerSettings.redis && config.loggerSettings.redis.enabled) {
  loggerConfig.transports.push(new (winston.transports.Redis)({
    level: 'audit',
    length: 4294967295,
    host: config.loggerSettings.redis.host,
    port: config.loggerSettings.redis.port,
    auth: config.loggerSettings.redis.auth,
  }));
}

const sequelizeTransport = WinstonSequelizeTransport(config);

if (sequelizeTransport) {
  loggerConfig.transports.push(sequelizeTransport);
}

if (config.hostingEnvironment.applicationInsights) {
  appInsights.setup(config.hostingEnvironment.applicationInsights).start();
  loggerConfig.transports.push(new WinstonApplicationInsights({ client: appInsights.defaultClient }));
}

const logger = new (winston.Logger)(loggerConfig);

process.on('unhandledRejection', (reason, p) => {
  logger.error('Unhandled Rejection at:', p, 'reason:', reason);
});

module.exports = logger;
