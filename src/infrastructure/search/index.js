const config = require('./../config');

let adapter;
if (config.search.type.toLowerCase() === 'api') {
  adapter = require('./api');
} else if (config.access.type.toLowerCase() === 'static') {
  adapter = require('./static');
} else {
  throw new Error(`Invalid search type ${config.search.type}`);
}

module.exports = adapter;
