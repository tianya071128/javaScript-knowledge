const base = require('./base');
const dev = require('./dev');

const env = 'dev';

const configMap = {
  dev,
};

module.exports = Object.assign(base, configMap[env]);
