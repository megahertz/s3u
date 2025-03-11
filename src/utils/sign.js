'use strict';

const { encodeSpecialUrlChars } = require('./encode');
const {
  bufferToHex,
  hmacSha256,
  hmacSha256Sync,
  sha256,
  sha256Sync,
} = require('./crypto');

module.exports = { buildSignedUrl, buildSignedUrlSync };

async function buildSignedUrl({
  accessKeyId = getEnv('AWS_ACCESS_KEY_ID'),
  secretAccessKey = getEnv('AWS_SECRET_ACCESS_KEY'),
  expires = 60 * 60 * 24 * 7,
  method = 'GET',
  region,
  timestamp = Date.now(),
  url: stringUrl,
}) {
  const algo = 'AWS4-HMAC-SHA256';
  const url = new URL(stringUrl);
  const time = new Date(timestamp)
    .toISOString()
    .slice(0, 19)
    .replace(/\W/g, '') + 'Z';
  const date = time.slice(0, 8);
  const scope = `${date}/${region}/s3/aws4_request`;

  url.searchParams.set('X-Amz-Algorithm', algo);
  url.searchParams.set('X-Amz-Credential', `${accessKeyId}/${scope}`);
  url.searchParams.set('X-Amz-Date', time);
  url.searchParams.set('X-Amz-Expires', expires.toString(10));
  url.searchParams.set('X-Amz-SignedHeaders', 'host');
  url.searchParams.sort();

  url.search = encodeSpecialUrlChars(url.search);
  url.pathname = encodeSpecialUrlChars(url.pathname);

  const request = [
    method.toUpperCase(),
    url.pathname,
    url.search.slice(1),
    `host:${url.host}`,
    '',
    'host',
    'UNSIGNED-PAYLOAD',
  ].join('\n');

  const signString = [algo, time, scope, await sha256(request)].join('\n');

  const signPromise = [date, region, 's3', 'aws4_request', signString]
    .reduce(
      (promise, data) => promise.then((prev) => hmacSha256(data, prev)),
      Promise.resolve('AWS4' + secretAccessKey)
    );

  return `${url.href}&X-Amz-Signature=${bufferToHex(await signPromise)}`;
}

function buildSignedUrlSync({
  accessKeyId = getEnv('AWS_ACCESS_KEY_ID'),
  secretAccessKey = getEnv('AWS_SECRET_ACCESS_KEY'),
  expires = 60 * 60 * 24 * 7,
  method = 'GET',
  region,
  timestamp = Date.now(),
  url: stringUrl,
}) {
  const algo = 'AWS4-HMAC-SHA256';
  const url = new URL(stringUrl);
  const time = new Date(timestamp)
    .toISOString()
    .slice(0, 19)
    .replace(/\W/g, '') + 'Z';
  const date = time.slice(0, 8);
  const scope = `${date}/${region}/s3/aws4_request`;

  url.searchParams.set('X-Amz-Algorithm', algo);
  url.searchParams.set('X-Amz-Credential', `${accessKeyId}/${scope}`);
  url.searchParams.set('X-Amz-Date', time);
  url.searchParams.set('X-Amz-Expires', expires.toString(10));
  url.searchParams.set('X-Amz-SignedHeaders', 'host');
  url.searchParams.sort();

  url.search = encodeSpecialUrlChars(url.search);
  url.pathname = encodeSpecialUrlChars(url.pathname);

  const request = [
    method.toUpperCase(),
    url.pathname,
    url.search.slice(1),
    `host:${url.host}`,
    '',
    'host',
    'UNSIGNED-PAYLOAD',
  ].join('\n');

  const signString = [algo, time, scope, sha256Sync(request)].join('\n');

  const signature = [date, region, 's3', 'aws4_request', signString]
    .reduce(
      (res, data) => hmacSha256Sync(data, res),
      'AWS4' + secretAccessKey
    );

  return `${url.href}&X-Amz-Signature=${bufferToHex(signature)}`;
}

function getEnv(name) {
  if (typeof process !== 'undefined' && process.env) {
    return process.env[name];
  }

  return undefined;
}
