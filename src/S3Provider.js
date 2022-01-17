'use strict';

/* eslint-disable no-unused-vars */

const S3Url = require('./S3Url');
const { decodeS3Key, encodeS3Key } = require('./utils');

class S3Provider {
  domain;
  endpoint;
  id;
  title;

  constructor({ id, domain, endpoint, title } = {}) {
    this.domain = domain;
    this.endpoint = endpoint || (domain && `https://s3.{region}.${domain}`);
    this.id = id || domain;
    this.title = title;
  }

  buildHostName({ s3Url }) {
    return [
      s3Url.bucketPosition === 'hostname' && s3Url.bucket,
      's3',
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

    if (hostnameParts[1] === 's3' || hostnameParts[1]?.startsWith('s3-')) {
      s3Url.setBucket(hostnameParts[0]);
      s3Url.setBucketPosition('hostname');
      return hostnameParts.slice(1).join('.');
    }

    const [bucket, ...keyParts] = s3Url.key.split('/');
    s3Url.setBucket(bucket);
    s3Url.setBucketPosition('pathname');
    s3Url.setKey(keyParts.join('/'));
    return hostname;
  }

  parseDomain(hostname, s3Url) {
    if (this.domain && hostname.endsWith(this.domain)) {
      s3Url.setDomain(this.domain);
      return hostname.slice(0, -this.domain.length).replace(/\.$/, '');
    }

    const hostnameParts = hostname.split('.');
    const genericSecondLevelDomain = hostnameParts.slice(-2).join('.');
    s3Url.setDomain(genericSecondLevelDomain);
    return hostnameParts.slice(0, -2).join('.');
  }

  parseRegion(hostname, s3Url) {
    const hostnameParts = hostname.split('.');

    if (hostnameParts[0]?.startsWith('s3-')) {
      s3Url.setRegion(hostnameParts[0].slice(3));
      return hostnameParts.slice(1).join('.');
    }

    if (hostnameParts[0] === 's3' && hostnameParts[1]) {
      s3Url.setRegion(hostnameParts[1]);
      return hostnameParts.slice(2).join('.');
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

    s3Url.setKey(decodeS3Key(s3Url.key));

    return s3Url;
  }
}

module.exports = S3Provider;
