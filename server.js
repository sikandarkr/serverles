const sls = require('serverless-http');
const handler = require('./handler');
module.exports.run = sls(handler);