'use strict';

/* eslint-disable no-unused-vars */

const S3Url = require('./S3Url');
const { decodeS3Key, encodeS3Key } = require('./utils/s3key');
const { bufferToHex, hmacSha256, sha256 } = require('./utils/crypto');

class S3Provider {
  constructor({ id, domain, endpoint, title } = {}) {
    this.domain = domain;
    this.endpoint = endpoint || (domain && `https://{region}.${domain}`);
    this.id = id || domain;
    this.title = title;
  }

  buildHostName({ s3Url }) {
    return [
      s3Url.bucketPosition === 'hostname' && s3Url.bucket,
      s3Url.region,
      s3Url.domain || this.domain,
    ]
      .filter(Boolean)
      .join('.');
  }

  buildPathName({ s3Url }) {
    return [
      s3Url.bucketPosition === 'pathname' && s3Url.bucket,
      encodeS3Key(s3Url.key),
    ]
      .filter(Boolean)
      .join('/');
  }

  async buildSignedUrl({
    accessKeyId = getEnv('AWS_ACCESS_KEY_ID'),
    secretAccessKey = getEnv('AWS_SECRET_ACCESS_KEY'),
    expires = 60 * 60 * 24 * 7,
    method = 'GET',
    s3Url,
  }) {
    const algo = 'AWS4-HMAC-SHA256';
    const url = new URL(this.buildUrl({ s3Url }));
    const time = new Date().toISOString().slice(0, 19).replace(/\W/g, '') + 'Z';
    const date = time.slice(0, 8);
    const scope = `${date}/${s3Url.region}/s3/aws4_request`;

    url.searchParams.set('X-Amz-Algorithm', algo);
    url.searchParams.set('X-Amz-Credential', `${accessKeyId}/${scope}`);
    url.searchParams.set('X-Amz-Date', time);
    url.searchParams.set('X-Amz-Expires', expires.toString(10));
    url.searchParams.set('X-Amz-SignedHeaders', 'host');
    url.searchParams.sort();

    url.pathname = url.pathname
      .replace(/\+/g, '%20')
      // eslint-disable-next-line arrow-body-style
      .replace(/[!'()*]/g, (c) => {
        return '%' + c.charCodeAt(0).toString(16).toUpperCase();
      });

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

    const signPromise = [date, s3Url.region, 's3', 'aws4_request', signString]
      .reduce(
        (promise, data) => promise.then((prev) => hmacSha256(data, prev)),
        Promise.resolve('AWS4' + secretAccessKey)
      );

    url.searchParams.set('X-Amz-Signature', bufferToHex(await signPromise));

    return url.href;
  }

  buildUrl({ s3Url }) {
    const hostname = this.buildHostName({ s3Url });
    const pathname = this.buildPathName({ s3Url });

    const url = new URL(`${s3Url.protocol}${hostname}/${pathname}`);
    url.hash = s3Url.hash;
    url.password = s3Url.password;
    url.port = s3Url.port;
    url.search = s3Url.search;
    url.username = s3Url.username;

    return url.href;
  }

  getEndpoint({ region } = {}) {
    if (!this.endpoint) {
      throw new Error('Cannot detect an endpoint for the S3 provider');
    }

    if (region) {
      return this.endpoint.replace('{region}', region);
    }

    return this.endpoint.replace('{region}.', '');
  }

  matchHostName(hostName) {
    return hostName.endsWith(this.domain);
  }

  parseBucket(hostname, s3Url) {
    const hostnameParts = hostname.split('.');

    // like {bucket}.{region}.digitaloceanspaces.com
    if (hostnameParts.length >= 2) {
      s3Url.setBucket(hostnameParts.slice(0, -1).join('.'));
      s3Url.setBucketPosition('hostname');
      return hostnameParts.slice(-1).join('.');
    }

    return hostname;
  }

  parseBucketFromPathname(s3Url) {
    const [bucket, ...keyParts] = s3Url.key.split('/');

    if (!bucket) {
      return;
    }

    s3Url.setBucket(bucket);
    s3Url.setBucketPosition('pathname');
    s3Url.setKey(keyParts.join('/'));
  }

  parseDomain(hostname, s3Url) {
    if (s3Url.protocol === 's3:') {
      s3Url.setDomain(this.domain || 'amazonaws.com');
      s3Url.setBucket(hostname);
      return '';
    }

    if (this.domain && hostname.endsWith(this.domain)) {
      s3Url.setDomain(this.domain);
      return hostname.slice(0, -this.domain.length).replace(/\.$/, '');
    }

    const hostnameParts = hostname.split('.');

    if (hostnameParts.length < 2) {
      throw new Error(`Cannot parse domain name from the host '${hostname}'`);
    }

    const genericSecondLevelDomain = hostnameParts.slice(-2).join('.');
    s3Url.setDomain(genericSecondLevelDomain);
    return hostnameParts.slice(0, -2).join('.');
  }

  parseRegion(hostname, s3Url) {
    const hostnameParts = hostname.split('.');

    if (hostnameParts.length > 0) {
      s3Url.setRegion(hostnameParts.shift());
      return hostnameParts.join('.');
    }

    return hostname;
  }

  parseUrl({ url }) {
    const urlObj = new URL(url);
    const s3Url = new S3Url({
      hash: urlObj.hash,
      key: urlObj.pathname.replace(/^\//, ''),
      password: urlObj.password,
      port: urlObj.port,
      protocol: urlObj.protocol,
      provider: this,
      search: urlObj.search,
      sourceUrl: url,
      username: urlObj.username,
    });

    let hostString = this.parseDomain(urlObj.hostname, s3Url);
    hostString = this.parseBucket(hostString, s3Url);
    this.parseRegion(hostString, s3Url);

    if (!s3Url.bucket) {
      this.parseBucketFromPathname(s3Url);
    }

    s3Url.setKey(decodeS3Key(s3Url.key));

    return s3Url;
  }
}

function getEnv(name) {
  if (typeof process !== 'undefined' && process.env) {
    return process.env[name];
  }

  return undefined;
}

module.exports = S3Provider;
