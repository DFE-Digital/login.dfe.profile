const Account = require('./Account');
const config = require('./../config');
const KeepAliveAgent = require('agentkeepalive').HttpsAgent;

const rp = require('request-promise').defaults({
  agent: new KeepAliveAgent({
    maxSockets: config.hostingEnvironment.agentKeepAlive.maxSockets,
    maxFreeSockets: config.hostingEnvironment.agentKeepAlive.maxFreeSockets,
    timeout: config.hostingEnvironment.agentKeepAlive.timeout,
    keepAliveTimeout: config.hostingEnvironment.agentKeepAlive.keepAliveTimeout,
  }),
});
const jwtStrategy = require('login.dfe.jwt-strategies');


const callDirectoriesApi = async (resource, body, method = 'POST', reqId) => {
  const token = await jwtStrategy(config.directories.service).getBearerToken();
  try {
    const opts = {
      method,
      uri: `${config.directories.service.url}/${resource}`,
      headers: {
        authorization: `bearer ${token}`,
        'x-correlation-id': reqId,
      },
      json: true,
    };
    if (method === 'POST' || method === 'PATCH' || method === 'PUT') {
      opts.body = body;
    }
    const result = await rp(opts);

    return {
      success: true,
      result,
    };
  } catch (e) {
    return {
      success: false,
      statusCode: e.statusCode,
      errorMessage: e.message,
    };
  }
};

class DirectoriesApiAccount extends Account {
  static fromContext(user) {
    return new DirectoriesApiAccount(user);
  }

  static async getById(id) {
    const response = await callDirectoriesApi(`users/${id}`, null, 'GET');
    if (!response.success) {
      if (response.statusCode === 404) {
        return null;
      }
      throw new Error(response.errorMessage);
    }
    return new DirectoriesApiAccount(response.result);
  }

  static async getByEmail(email) {
    const response = await callDirectoriesApi(`users/${email}`, null, 'GET');
    if (!response.success) {
      if (response.statusCode === 404) {
        return null;
      }
      throw new Error(response.errorMessage);
    }
    return new DirectoriesApiAccount(response.result);
  }

  async validatePassword(password, reqId) {
    const username = this.claims.email;
    const response = await callDirectoriesApi('users/authenticate', {
      username,
      password,
    }, 'POST', reqId);
    return response.success;
  }

  async setPassword(password, reqId) {
    const uid = this.claims.sub;
    const response = await callDirectoriesApi(`users/${uid}/changepassword`, {
      password,
    }, 'POST', reqId);
    if (!response.success) {
      throw new Error(response.errorMessage);
    }
  }

  async update(reqId) {
    const uid = this.claims.sub;
    const response = await callDirectoriesApi(`users/${uid}`, {
      given_name: this.givenName,
      family_name: this.familyName,
      email: this.email,
    }, 'PATCH', reqId);
    if (!response.success) {
      throw new Error(response.errorMessage);
    }
  }

  async assignDevice(type, serialNumber, reqId) {
    const response = await callDirectoriesApi(`users/${this.id}/devices`, { type, serialNumber }, 'POST', reqId);
    if (!response.success) {
      throw new Error(response.errorMessage);
    }
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
    const response = await callDirectoriesApi(`users/by-ids?id=${ids.toString()}`, null, 'GET');
    if (!response.success) {
      if (response.statusCode === 404) {
        return null;
      }
      throw new Error(response.errorMessage);
    }
    return response.result;
  }
}

module.exports = DirectoriesApiAccount;
