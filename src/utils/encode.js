'use strict';

module.exports = { decodeS3Key, encodeS3Key, encodeSpecialUrlChars };

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

function encodeSpecialUrlChars(string) {
  return string.replace(/\+/g, '%20')
    // eslint-disable-next-line arrow-body-style
    .replace(/[!'()*]/g, (c) => {
      return '%' + c.charCodeAt(0).toString(16).toUpperCase();
    });
}
