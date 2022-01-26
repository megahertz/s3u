'use strict';

/* eslint-env browser */

module.exports = { bufferToHex, hash, hmac };

const encoder = new TextEncoder();

async function hmac(message, secret) {
  const cryptoKey = await window.crypto.subtle.importKey(
    'raw',
    toBuffer(secret),
    { name: 'HMAC', hash: { name: 'SHA-256' } },
    false,
    ['sign']
  );
  return window.crypto.subtle.sign('HMAC', cryptoKey, toBuffer(message));
}

async function hash(message) {
  return window.crypto.subtle.digest('SHA-256', toBuffer(message));
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
