const createInvitation = async (firstName, lastName, email, clientId, redirectUri) => {
  return Promise.resolve('2bd66a95-5af6-4796-a793-8a50222cedf3');
};

const getInvitationById = async (id) => {
  return Promise.resolve(null);
};

const convertInvitationToUser = async (id, password) => {
  return Promise.resolve(null);
};

const getInvitationByEmail = async (id) => {
  return Promise.resolve(null);
};

const updateInvite = async (id, email, correlationId) => {
  return Promise.resolve(null);
};

const resendInvitation = async (id, correlationId) => {
  return Promise.resolve(null);
};

module.exports = {
  createInvitation,
  getInvitationById,
  convertInvitationToUser,
  getInvitationByEmail,
  updateInvite,
  resendInvitation,
};
