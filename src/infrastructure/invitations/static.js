const createInvitation = async (firstName, lastName, email, clientId, redirectUri) => {
  return Promise.resolve('2bd66a95-5af6-4796-a793-8a50222cedf3');
};

const getInvitationById = async (id) => {
  return Promise.resolve(null);
};

module.exports = {
  createInvitation,
  getInvitationById,
};