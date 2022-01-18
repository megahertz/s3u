'use strict';

module.exports = { decodeS3Key, encodeS3Key };

function decodeS3Key(key) {
  if (typeof key !== 'string') {
    return key;
  }

  return decodeURIComponent(key.replace(/\+/g, '%20'));
}

function encodeS3Key(key) {
  if (typeof key !== 'string') {
    return key;
  }

  return encodeURIComponent(key)
    .replace(/%20/g, '+')
    .replace(/%2f/gi, '/');
}
