'use strict';

const S3Provider = require('../S3Provider');
const { encodeS3Key } = require('../utils/encode');

class CloudflareR2Provider extends S3Provider {
  constructor({
    domain,
    endpoint,
    id,
    title,
  } = {
    id: 'cloudflarestorage.com',
    domain: 'r2.cloudflarestorage.com',
    title: 'Cloudflare R2',
  }) {
    super({ id, domain, endpoint, title });
  }

  buildHostName({ s3Url }) {
    return [s3Url.region, s3Url.domain || this.domain]
      .filter(Boolean)
      .join('.');
  }

  buildPathName({ s3Url }) {
    return [s3Url.bucket, encodeS3Key(s3Url.key)].filter(Boolean).join('/');
  }

  getSignRegion(_s3Url) {
    return 'auto';
  }

  parseBucket(hostname, s3Url) {
    s3Url.setBucketPosition('pathname');
    s3Url.setRegion(hostname);
    return '';
  }
}

module.exports = CloudflareR2Provider;
