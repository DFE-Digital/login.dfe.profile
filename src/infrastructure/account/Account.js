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
