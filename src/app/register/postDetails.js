const { validateRP } = require('./utils');
const emailValidator = require('email-validator');
const { createInvitation } = require('./../../infrastructure/invitations');

const validateInput = (req) => {
  const model = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    validationMessages: {},
  };

  if (!model.firstName || model.firstName.trim().length === 0) {
    model.validationMessages.firstName = 'Please enter your first name';
  }

  if (!model.lastName || model.lastName.trim().length === 0) {
    model.validationMessages.lastName = 'Please enter your last name';
  }

  if (!model.email || model.email.trim().length === 0) {
    model.validationMessages.email = 'Please enter your email address';
  } else if (!emailValidator.validate(model.email)) {
    model.validationMessages.email = 'Please enter a valid email address';
  }

  model.isValid = Object.keys(model.validationMessages).length === 0;
  return model;
};
const sendInvitation = async (model, rpDetails) => {
  const invitationId = await createInvitation(model.firstName, model.lastName, model.email,
    rpDetails.clientId, rpDetails.redirectUri);
  return invitationId;
};

const postDetails = async (req, res) => {
  const rpDetails = await validateRP(req);
  if (!rpDetails) {
    return res.status(400).render('register/views/invalidRedirectUri');
  }

  const model = validateInput(req);
  if (!model.isValid) {
    model.csrfToken = req.csrfToken();
    return res.render('register/views/details', model);
  }

  const invitationId = await sendInvitation(model, rpDetails);
  return res.redirect(`/register/${invitationId}/verify`);
};

module.exports = postDetails;
