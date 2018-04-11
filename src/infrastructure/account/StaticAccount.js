const Account = require('./Account');

const accounts = [
  {
    sub: '6cb83f92-980f-4782-aa81-b63334dae995',
    name: 'Tony Stark',
    email: 'tony.stark@stark-industries.test',
  },
  {
    sub: '86ee7a5f-1c2e-4edf-9812-7fa867cce122',
    name: 'Steve Rodgers',
    email: 'captain@army.test',
  },
  {
    sub: 'aa3c5dac-f53c-4db6-a3df-ff1339434c74',
    name: 'Bruce Banner',
    email: 'hulk@biggreen.test',
  },
  {
    sub: '63401a04-745c-46fc-bdaf-2147ba71d214',
    name: 'Thor',
    email: 'thor@asgard.test',
  },
];

class StaticAccount extends Account {
  static fromContext(user) {
    return new StaticAccount(user);
  }

  static async getById(id) {
    const account = accounts.find(item => item.sub.toLowerCase() === id.toLowerCase());
    return Promise.resolve(account ? new StaticAccount(account) : null);
  }

  static async getByEmail(email) {
    const account = accounts.find(item => item.email.toLowerCase() === email.toLowerCase());
    return Promise.resolve(account ? new StaticAccount(account) : null);
  }

  async assignDevice(type, serialNumber, reqId) {
    return Promise.resolve();
  }

  async generateChangeEmailCode(newEmailAddress, reqId) {
    return Promise.resolve('ABC123');
  }

  async getChangeEmailCode() {
    return Promise.resolve({
      code: 'ABC123',
      newEmail: 'john.doe@stub.test',
    });
  }

  async getUsersById(ids) {
    return Promise.resolve(null);
  }
}

module.exports = StaticAccount;
