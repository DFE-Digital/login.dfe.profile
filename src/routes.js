const passport = require('passport');
const profile = require('./app/profile');
const changePassword = require('./app/changePassword');
const signOut = require('./app/signOut');
const logger = require('./infrastructure/logger');

const routes = (app, csrf) => {
  // auth callbacks
  app.get('/auth', passport.authenticate('oidc'));
  app.get('/auth/cb', (req, res, next) => {
    logger.info('in auth callback');

    passport.authenticate('oidc', (err, user) => {
      let redirectUrl = '/';

      if (err) {
        logger.error(`Error in auth callback - ${err}`);
        return next(err);
      }
      if (!user) {
        return res.redirect('/');
      }

      logger.info(`Authenticated user ${JSON.stringify(user)}`);
      if (req.session.redirectUrl) {
        redirectUrl = req.session.redirectUrl;
        req.session.redirectUrl = null;
      }

      return req.logIn(user, (loginErr) => {
        if (loginErr) {
          logger.error(`Login error in auth callback - ${loginErr}`);
          return next(loginErr);
        }
        if (redirectUrl.endsWith('signout/complete')) redirectUrl = '/';
        return res.redirect(redirectUrl);
      });
    })(req, res, next);
  });

  // app routes
  app.use('/', profile(csrf));
  app.use('/change-password', changePassword(csrf));
  app.use('/signout', signOut(csrf));
};

module.exports = routes;
