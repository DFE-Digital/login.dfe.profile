const express = require('express');
const passport = require('passport');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const expressLayouts = require('express-ejs-layouts');
const session = require('express-session');
const morgan = require('morgan');
const logger = require('./infrastructure/logger');
const https = require('https');
const fs = require('fs');
const path = require('path');
const csurf = require('csurf');
const flash = require('express-flash-2');
const config = require('./infrastructure/config');
const getPassportStrategy = require('./infrastructure/oidc');

const registerRoutes = require('./routes');
const { profileSchema, validateConfigAndQuitOnError } = require('login.dfe.config.schema');
const setCorrelationId = require('express-mw-correlation-id');

const init = async () => {
  validateConfigAndQuitOnError(profileSchema, config, logger);

  const app = express();
  app.use(setCorrelationId(true));
  const csrf = csurf({ cookie: true });

  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(cookieParser());
  app.use(morgan('combined', { stream: fs.createWriteStream('./access.log', { flags: 'a' }) }));
  app.use(morgan('dev'));
  app.set('view engine', 'ejs');
  app.set('views', path.resolve(__dirname, 'app'));
  app.use(expressLayouts);
  app.set('layout', 'layouts/layout');
  app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: config.hostingEnvironment.sessionSecret,
  }));
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


  registerRoutes(app, csrf);

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
