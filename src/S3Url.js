'use strict';

class S3Url {
  /**
   * @param {Partial<S3Url> | string} options
   */
  constructor(options = {}) {
    this.bucket = '';
    this.bucketPosition = 'hostname';
    this.cdn = false;
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

    if (typeof options === 'string') {
      // eslint-disable-next-line no-constructor-return
      return this.constructor.fromUrl({ url: options });
    }

    const { dirPath, fileName, provider, ...attrs } = options;
    Object.assign(this, attrs);

    if (!(options instanceof S3Url)) {
      dirPath && this.setDirPath(dirPath);
      fileName && this.setFileName(fileName);
      provider && this.setProvider(provider);
    }

    this.updateBucketPosition();
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

  get dirPath() {
    return this.key.split('/').slice(0, -1).join('/');
  }

  get fileName() {
    return this.key.split('/').pop();
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

  setCdn(cdn) {
    this.cdn = cdn;
    return this;
  }

  setDirPath(dirPath) {
    this.setKey(`${dirPath}/${this.fileName}`);
    return this;
  }

  setDomain(domain) {
    this.domain = domain;
    return this;
  }

  setFileName(fileName) {
    this.setKey(`${this.dirPath}/${fileName}`);
    return this;
  }

  setKey(key) {
    this.key = key;
    this.trimSlashes({ begin: true });
    return this;
  }

  setProtocol(protocol) {
    this.protocol = protocol;
    return this;
  }

  setProvider(provider) {
    if (provider && provider.buildUrl) {
      this.provider = provider;
      return this;
    }

    if (typeof provider === 'string' && this.constructor.parser) {
      this.provider = this.constructor.parser.getProviderById(provider);
      return this;
    }

    return this;
  }

  setRegion(region) {
    this.region = region;
    return this;
  }

  async sign({
    accessKeyId,
    expires,
    method,
    secretAccessKey,
  } = {}) {
    if (!this.provider) {
      throw new Error('Cannot sign url from invalid S3Url');
    }

    return this.provider.buildSignedUrl({
      accessKeyId,
      expires,
      method,
      s3Url: this,
      secretAccessKey,
    });
  }

  trimSlashes({ begin = false, end = false } = {}) {
    let key = this.key;

    if (begin) {
      key = key.replace(/^\/+/, '');
    }

    if (end) {
      key = key.replace(/\/+$/, '');
    }

    this.key = key;

    return this;
  }

  toString() {
    return this.href;
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
