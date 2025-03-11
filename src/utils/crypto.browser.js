'use strict';

/* eslint-env browser */

const sha = require('./sha256');

module.exports = {
  bufferToHex,
  hmacSha256,
  hmacSha256Sync,
  sha256,
  sha256Sync,
};

const encoder = new TextEncoder();

async function hmacSha256(message, secret) {
  const cryptoKey = await window.crypto.subtle.importKey(
    'raw',
    toBuffer(secret),
    { name: 'HMAC', hash: { name: 'SHA-256' } },
    false,
    ['sign']
  );
  return window.crypto.subtle.sign('HMAC', cryptoKey, toBuffer(message));
}

function hmacSha256Sync(message, secret) {
  return sha.hmac_sha256(message, secret);
}

async function sha256(message) {
  return bufferToHex(
    await window.crypto.subtle.digest('SHA-256', toBuffer(message))
  );
}

function sha256Sync(message) {
  return sha.sha256(message);
}

function bufferToHex(buffer) {
  const hexArr = Array.prototype.map.call(
    new Uint8Array(buffer),
    (byte) => ('0' + byte.toString(16)).slice(-2)
  );

  return hexArr.join('');
}

function toBuffer(input) {
  if (typeof input === 'string') {
    return encoder.encode(input);
  }

  return input;
}
