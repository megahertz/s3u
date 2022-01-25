'use strict';

const S3Provider = require('../S3Provider');

class DigitalOceanSpacesProvider extends S3Provider {
  constructor({
    domain,
    endpoint,
    id,
    title,
  } = { domain: 'digitaloceanspaces.com', title: 'DigitalOcean' }) {
    super({ id, domain, endpoint, title });
  }

  buildHostName({ s3Url }) {
    return [
      s3Url.bucketPosition === 'hostname' && s3Url.bucket,
      s3Url.region,
      s3Url.cdn ? 'cdn' : null,
      s3Url.domain || this.domain,
    ]
      .filter(Boolean)
      .join('.');
  }

  parseBucket(hostname, s3Url) {
    const hostnameParts = hostname.split('.');

    if (hostnameParts.slice(-1)[0] === 'cdn') {
      s3Url.setCdn(true);
      return super.parseBucket(hostnameParts.slice(0, -1).join('.'), s3Url);
    }

    return super.parseBucket(hostname, s3Url);
  }
}

module.exports = DigitalOceanSpacesProvider;
