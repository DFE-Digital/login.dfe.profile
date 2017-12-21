const DirectoriesApiAccount = require('./DirectoriesApiAccount');
const StaticAccount = require('./StaticAccount');
const config = require('./../config');

let account;
if (config.directories.type.toLowerCase() === 'api') {
  account = DirectoriesApiAccount;
} else {
  account = StaticAccount;
}
module.exports = account;
