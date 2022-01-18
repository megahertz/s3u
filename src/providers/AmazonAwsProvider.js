'use strict';

const S3Provider = require('../S3Provider');

class AmazonAwsProvider extends S3Provider {
  constructor({
    domain,
    endpoint,
    id,
    title,
  } = { domain: 'amazonaws.com', title: 'Amazon S3' }) {
    super({ id, domain, endpoint, title });
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

  parseBucket(hostname, s3Url) {
    const hostnameParts = hostname.split('.');

    // eslint-disable-next-line arrow-body-style
    const s3Pos = hostnameParts.findIndex((p) => {
      return p === 's3' || p.startsWith('s3-');
    });

    // like {bucket}.s3.amazonaws.com
    if (s3Pos > 0) {
      s3Url.setBucket(hostnameParts.slice(0, s3Pos).join('.'));
      s3Url.setBucketPosition('hostname');
      return hostnameParts.slice(s3Pos).join('.');
    }

    return hostname;
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
}

module.exports = AmazonAwsProvider;
