'use strict';

const crypto = require('crypto');

module.exports = { bufferToHex, hash, hmac };

async function hmac(message, secret) {
  return crypto
    .createHmac('sha256', secret)
    .update(message, 'utf8')
    .digest();
}

async function hash(message) {
  return crypto
    .createHash('sha256')
    .update(message, 'utf8')
    .digest('hex');
}

function bufferToHex(buffer) {
  return buffer.toString('hex');
}
