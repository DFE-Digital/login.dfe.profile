'use strict';

const { getServicesForUser } = require('../../infrastructure/access');
const { getOrganisationsAssociatedWithUser, getPendingRequestsForApproval } = require('../../infrastructure/services');

const APPROVER = 10000;

const isLoggedIn = (req, res, next) => {
  const serviceType = req.query? req.query.service_type:null;
  if (req.isAuthenticated() || (req.baseUrl === '/signout' && serviceType !== 'saml')) {
    return next();
  }

  req.session.redirectUrl = req.originalUrl;
  return res.status(302).redirect('/auth');
};

const setApproverContext = async (req, res, next) => {
  res.locals.isApprover = false;
  if (req.user) {
    const user = req.user;
    const services = await getServicesForUser(user.sub, req.header('x-correlation-id'));
    res.locals.isApprover = services.some(s => s.role.id >= APPROVER && s.status > 0);
  }
  next();
};

const getUserEmail = user => user.email || '';

const getUserDisplayName = user => `${user.given_name || ''} ${user.family_name || ''}`.trim();

const setUserContext = async (req, res, next) => {
  if (req.user) {
    res.locals.user = req.user;
    res.locals.displayName = getUserDisplayName(req.user);
    const organisations = await getOrganisationsAssociatedWithUser(req.user.sub, req.id);
    req.userOrganisations = organisations;
    try {
      if (req.userOrganisations) {
        res.locals.isApprover = req.userOrganisations.filter(x => x.role.id === 10000).length > 0;
      }
      if(res.locals.isApprover){
        req.approverRequests = await getPendingRequestsForApproval(req.user.sub, req.id);
      }
    } catch (e) {
      return e;
    }
  }
  next();
};

const asyncMiddleware = fn =>
  (req, res, next) => {
    Promise.resolve(fn(req, res, next))
      .catch(next);
  };

module.exports = { isLoggedIn, getUserEmail, getUserDisplayName, setUserContext, setApproverContext, asyncMiddleware };
