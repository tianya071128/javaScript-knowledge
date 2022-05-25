const base = require('./base');
const dev = require('./dev');
const pro = require('./pro');

const env = process.env.NODE_ENV || 'dev';

const configMap = {
  dev,
  pro,
};

module.exports = Object.assign(base, configMap[env]);
