class Account {
  constructor(claims) {
    this.claims = claims;
  }

  get id() {
    return this.claims.sub;
  }

  get email() {
    return this.claims.email;
  }
  set email(email) {
    this.claims.email = email;
  }

  get givenName() {
    return this.claims.given_name;
  }
  set givenName(given_name) {
    this.claims.given_name = given_name;
  }

  get familyName() {
    return this.claims.family_name;
  }
  set familyName(family_name) {
    this.claims.family_name = family_name;
  }

  get name() {
    let name = this.claims.name;
    if (!name) {
      name = `${this.claims.given_name} ${this.claims.family_name}`.trim();
    }
    return name;
  }

  static fromContext() {
    return null;
  }

  static async getById() {
    return Promise.resolve(null);
  }

  static async validatePassword() {
    return Promise.resolve(true);
  }

  static async setPassword() {
    return Promise.resolve(null);
  }
  static async getUsersById() {
    return Promise.resolve(null);
  }
}

module.exports = Account;
