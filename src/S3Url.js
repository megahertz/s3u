'use strict';

class S3Url {
  /**
   * @param {Partial<S3Url>} attrs
   */
  constructor(attrs = {}) {
    this.bucket = '';
    this.bucketPosition = 'hostname';
    this.domain = '';
    this.error = null;
    this.hash = '';
    this.key = '';
    this.password = '';
    this.port = '';
    this.protocol = 'https:';
    this.provider = null;
    this.region = '';
    this.search = '';
    this.sourceUrl = '';
    this.username = '';

    if (typeof attrs === 'string') {
      // eslint-disable-next-line no-constructor-return
      return this.constructor.fromUrl({ url: attrs });
    }

    Object.assign(this, attrs);
  }

  static fromUrl({ url, providerId = '' }) {
    if (!this.parser) {
      throw new Error('S3Url.parser is not set');
    }

    return this.parser.parseUrl({ url, providerId });
  }

  static setParser(parser) {
    this.parser = parser;
  }

  get href() {
    if (!this.provider) {
      throw new Error('Cannot make url from invalid S3Url');
    }

    return this.provider.buildUrl({ s3Url: this });
  }

  get isValid() {
    return Boolean(this.provider && typeof this.provider === 'object');
  }

  clone(newAttrs = {}) {
    return new S3Url({ ...this, ...newAttrs });
  }

  setBucket(bucket) {
    this.bucket = bucket;
    this.updateBucketPosition();
  }

  setBucketPosition(position) {
    this.bucketPosition = position;
    this.updateBucketPosition();
  }

  setDomain(domain) {
    this.domain = domain;
  }

  setKey(key) {
    this.key = key;
  }

  setRegion(region) {
    this.region = region;
  }

  toString() {
    return this.makeUrl();
  }

  updateBucketPosition() {
    if (!this.bucket) {
      return;
    }

    // If a bucket contains dot, only pathname could be used.
    if (this.bucket.includes('.')) {
      this.bucketPosition = 'pathname';
    }
  }
}

module.exports = S3Url;
