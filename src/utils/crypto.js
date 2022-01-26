'use strict';

const crypto = require('crypto');

module.exports = { bufferToHex, hmacSha256, sha256 };

async function hmacSha256(message, secret) {
  return crypto
    .createHmac('sha256', secret)
    .update(message, 'utf8')
    .digest();
}

async function sha256(message) {
  return crypto
    .createHash('sha256')
    .update(message, 'utf8')
    .digest('hex');
}

function bufferToHex(buffer) {
  return buffer.toString('hex');
}
