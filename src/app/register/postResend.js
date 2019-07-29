const { getInvitationById, getInvitationByEmail } = require('./../../infrastructure/invitations');
const Account = require('./../../infrastructure/account');
const { emailPolicy } = require('login.dfe.validation');
const logger = require('./../../infrastructure/logger');

const validate = async (req) => {

  let email;

  if (req.session.registration && req.session.registration.invitationId === req.params.id) {
    email = req.session.registration.email;
  } else {
    const invitation = await getInvitationById(req.params.id);
    if (invitation) {
      email = invitation.email;
    }
  }
  const model = {
    csrfToken: req.csrfToken(),
    invitationId: req.params.id,
    validationMessages: {},
    existingEmail: email,
    email: req.body.email.trim() || '',
    hideNav: true,
    backLink: true,
    title: 'Resend verification email - DfE Sign-in',
    noChangedEmail: false,
    isExistingUser: false,
  };

  if (model.email === email) {
    model.noChangedEmail = true;
    return model;
  }

  if (!model.email) {
    model.validationMessages.email = 'Enter an email address';
  } else if (!emailPolicy.doesEmailMeetPolicy(model.email)) {
    model.validationMessages.email = 'Enter a valid email address';
  } else {
    const existingUser = await Account.getById(model.email);
    const existingInvitation = await getInvitationByEmail(model.email);
    if (existingUser) {
      model.isExistingUser = true;
    } else if (existingInvitation) {
      model.noChangedEmail = true;
    }
  }
  return model;
};

const postResend = async (req, res) => {
  const model = await validate(req);

  if (Object.keys(model.validationMessages).length > 0) {
    model.csrfToken = req.csrfToken();
    return res.render('register/views/resend', model);
  }

  if (!model.isExistingUser) {
    if (model.noChangedEmail) {
      await Account.resendInvitation(req.params.id);
      logger.audit(`Resent invitation email to ${model.email} (id: ${model.invitationId})`, {
        type: 'resent-invitation',
        invitedUserEmail: model.email,
        invitationId: model.invitationId,
      });
    } else {
      await Account.updateInvite(req.params.id, model.email);
      logger.audit(`updated invitation email to ${model.email} (id: ${model.invitationId})`, {
        type: 'changed-invitation-email',
        invitedUserEmail: model.email,
        invitationId: model.invitationId,
      });
    }
  }
  req.session.registration.email = model.email;

  res.redirect(`/register/${req.params.id}`);
};

module.exports = postResend;
