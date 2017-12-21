class ServiceUser {
  constructor({ id, name, role, status, organisation }) {
    this.id = id;
    this.name = name;
    this.role = role;
    this.status = status;
    this.organisation = organisation;
  }
}

module.exports = ServiceUser;
