'use strict';

const { describe, expect, it } = require('humile');
const CloudflareR2Provider = require('../CloudflareR2Provider');
const S3Url = require('../../S3Url');

describe(CloudflareR2Provider.name, () => {
  describe(CloudflareR2Provider.prototype.parseUrl.name, () => {
    it('simple', () => {
      expectParsed('https://id.r2.cloudflarestorage.com/test/file.txt', {
        bucket: 'test',
        bucketPosition: 'pathname',
        key: 'file.txt',
        region: 'id',
      });
    });

    it('account and jurisdictions', () => {
      expectParsed('https://id.eu.r2.cloudflarestorage.com/test/file.txt', {
        bucket: 'test',
        bucketPosition: 'pathname',
        key: 'file.txt',
        region: 'id.eu',
      });
    });
  });

  describe(CloudflareR2Provider.prototype.buildUrl.name, () => {
    it('builds a simple url', () => {
      expect(buildUrl('https://id.r2.cloudflarestorage.com/test/file.txt'))
        .toBe('https://id.r2.cloudflarestorage.com/test/file.txt');
    });

    it('builds a url with jurisdictions', () => {
      expect(buildUrl('https://id.eu.r2.cloudflarestorage.com/test/file.txt'))
        .toBe('https://id.eu.r2.cloudflarestorage.com/test/file.txt');
    });
  });

  function expectParsed(url, matchedObject) {
    const provider = new CloudflareR2Provider();
    expect(provider.parseUrl({ url })).toMatchObject(matchedObject);
  }

  function buildUrl(url) {
    const provider = new CloudflareR2Provider();
    const s3Url = url instanceof S3Url ? url : provider.parseUrl({ url });
    return provider.buildUrl({ s3Url });
  }
});
