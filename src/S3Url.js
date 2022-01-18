'use strict';

class S3Url {
  static parser;

  bucket = '';
  bucketPosition = 'hostname';
  domain = '';
  error = null;
  hash = '';
  key = '';
  password = '';
  port = '';
  protocol = 'https:';
  provider = null;
  region = '';
  search = '';
  sourceUrl = '';
  username = '';

  /**
   * @param {Partial<S3Url>} attrs
   */
  constructor(attrs = {}) {
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
  }

  setBucketPosition(position) {
    this.bucketPosition = position;
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
}

module.exports = S3Url;
