const config = require('./infrastructure/config');
const express = require('express');
const passport = require('passport');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const expressLayouts = require('express-ejs-layouts');
const session = require('cookie-session');
const logger = require('./infrastructure/logger');
const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const csurf = require('csurf');
const flash = require('express-flash-2');
const getPassportStrategy = require('./infrastructure/oidc');
const helmet = require('helmet');
const sanitization = require('login.dfe.sanitization');
const { getErrorHandler, ejsErrorPages } = require('login.dfe.express-error-handling');
const registerRoutes = require('./routes');
const setCorrelationId = require('express-mw-correlation-id');
const { setUserContext } = require('./infrastructure/utils');
const configSchema = require('./infrastructure/config/schema');

configSchema.validate();

https.globalAgent.maxSockets = http.globalAgent.maxSockets =
  config.hostingEnvironment.agentKeepAlive.maxSockets || 50;

const init = async () => {
  const app = express();
  app.use(helmet({
    noCache: true,
    frameguard: {
      action: 'deny',
    },
    hsts:{
      maxAge: 123456,
    }
  }));
  app.use(setCorrelationId(true));

  if (config.hostingEnvironment.env !== 'dev') {
    app.set('trust proxy', 1);
  }

  const csrf = csurf({
    cookie: {
      secure: true,
      httpOnly: true,
    },
  });

  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(cookieParser());
  app.use(sanitization({
    sanitizer: (key, value) => {
      const fieldToNotSanitize = ['givenName', 'familyName', 'newEmail', 'oldPassword', 'newPassword', 'confirmPassword'];
      if (fieldToNotSanitize.find(x => x.toLowerCase() === key.toLowerCase())) {
        return value;
      }
      return sanitization.defaultSanitizer(key, value);
    },
  }));

  app.set('view engine', 'ejs');
  app.set('views', path.resolve(__dirname, 'app'));
  app.use(expressLayouts);
  app.set('layout', 'sharedViews/layout');

  let expiryInMinutes = 30;
  const sessionExpiry = parseInt(config.hostingEnvironment.sessionCookieExpiryInMinutes);
  if (!isNaN(sessionExpiry)) {
    expiryInMinutes = sessionExpiry;
  }
  app.use(session({
    keys: [config.hostingEnvironment.sessionSecret],
    maxAge: expiryInMinutes * 60000, // Expiry in milliseconds
    httpOnly: true,
    secure: true
  }));
  app.use((req, res, next) => {
    req.session.now = Date.now();
    next();
  });

  app.use(flash());


  passport.use('oidc', await getPassportStrategy());
  passport.serializeUser((user, done) => {
    done(null, user);
  });
  passport.deserializeUser((user, done) => {
    done(null, user);
  });
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(setUserContext);

  // Setup global locals for layouts and views
  let assetsUrl = config.assets.url;
  assetsUrl = assetsUrl.endsWith('/') ? assetsUrl.substr(0, assetsUrl.length - 1) : assetsUrl;
  Object.assign(app.locals, {
    urls: {
      assetsUrl,
      services: config.hostingEnvironment.servicesUrl,
      interactions: config.hostingEnvironment.interactionsUrl,
      help: config.hostingEnvironment.helpUrl,
      survey: config.hostingEnvironment.surveyUrl,
    },
    app: {
      environmentBannerMessage: config.hostingEnvironment.environmentBannerMessage,
    },
    gaTrackingId: config.hostingEnvironment.gaTrackingId,
    assets: {
      version: config.assets.version
    },
  });

  registerRoutes(app, csrf);


  const errorPageRenderer = ejsErrorPages.getErrorPageRenderer({
    help: config.hostingEnvironment.helpUrl,
    assets: assetsUrl,
    assetsVersion: config.assets.version,
  }, config.hostingEnvironment.env === 'dev');
  app.use(getErrorHandler({
    logger,
    errorPageRenderer,
  }));

  if (config.hostingEnvironment.env === 'dev') {
    app.proxy = true;

    const options = {
      key: config.hostingEnvironment.sslKey,
      cert: config.hostingEnvironment.sslCert,
      requestCert: false,
      rejectUnauthorized: false,
    };
    const server = https.createServer(options, app);

    server.listen(config.hostingEnvironment.port, () => {
      logger.info(`Dev server listening on https://${config.hostingEnvironment.host}:${config.hostingEnvironment.port} with config:\n${JSON.stringify(config)}`);
    });
  } else {
    app.listen(process.env.PORT, () => {
      logger.info(`Server listening on http://${config.hostingEnvironment.host}:${config.hostingEnvironment.port}`);
    });
  }

  return app;
};

const app = init().catch(((err) => {
  logger.error(err);
}));

module.exports = app;
