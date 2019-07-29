const { validateRP } = require('./utils');
const { emailPolicy } = require('login.dfe.validation');
const { createInvitation } = require('./../../infrastructure/invitations');
const uuid = require('uuid/v4');

const validateInput = async (req) => {
  const model = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email ? req.body.email.trim() : null,
    validationMessages: {},
    hideNav: true,
    backLink: true,
  };

  if (!model.firstName || model.firstName.trim().length === 0) {
    model.validationMessages.firstName = 'Enter a first name';
  }

  if (!model.lastName || model.lastName.trim().length === 0) {
    model.validationMessages.lastName = 'Enter a last name';
  }

  if (!model.email || model.email.trim().length === 0) {
    model.validationMessages.email = 'Enter an email address';
  } else if (!emailPolicy.doesEmailMeetPolicy(model.email)) {
    model.validationMessages.email = 'Enter a valid email address';
  }

  model.isValid = Object.keys(model.validationMessages).length === 0;
  return model;
};
const sendInvitation = async (model, rpDetails) => {
  let invitationId = await createInvitation(model.firstName, model.lastName, model.email,
    rpDetails.clientId, rpDetails.redirectUri);
  if (!invitationId) {
    invitationId = uuid();
  }
  return invitationId;
};

const postDetails = async (req, res) => {
  const rpDetails = await validateRP(req);
  if (!rpDetails) {
    return res.status(400).render('register/views/invalidRedirectUri');
  }

  const model = await validateInput(req);
  if (!model.isValid) {
    model.csrfToken = req.csrfToken();
    return res.render('register/views/details', model);
  }

  const invitationId = await sendInvitation(model, rpDetails);

  req.session.registration = {
    invitationId,
    firstName: model.firstName,
    lastName: model.lastName,
    email: model.email,
    clientId: rpDetails.clientId,
    redirectUri: rpDetails.redirectUri,
  };

  return res.redirect(`/register/${invitationId}`);
};

module.exports = postDetails;
