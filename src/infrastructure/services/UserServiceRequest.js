class UserServiceRequest {
  constructor({ userId, organisation, service, role }) {
    this.userId = userId;
    this.organisation = organisation;
    this.service = service;
    this.role = role;
  }
}

module.exports = UserServiceRequest;
