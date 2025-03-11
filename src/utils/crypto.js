'use strict';

const crypto = require('crypto');

module.exports = {
  bufferToHex,
  hmacSha256,
  hmacSha256Sync,
  sha256,
  sha256Sync,
};

async function hmacSha256(message, secret) {
  return hmacSha256Sync(message, secret);
}

function hmacSha256Sync(message, secret) {
  return crypto
    .createHmac('sha256', secret)
    .update(message, 'utf8')
    .digest();
}

async function sha256(message) {
  return sha256Sync(message);
}

function sha256Sync(message) {
  return crypto
    .createHash('sha256')
    .update(message, 'utf8')
    .digest('hex');
}

function bufferToHex(buffer) {
  return buffer.toString('hex');
}
