'use strict';

const { describe, expect, it } = require('humile');
const DigitalOceanSpacesProvider = require('../DigitalOceanSpacesProvider');
const S3Url = require('../../S3Url');

describe('DigitalOceanSpacesProvider', () => {
  describe('parseUrl', () => {
    it('simple', () => {
      expectParsed('https://fra1.digitaloceanspaces.com/test/file.txt', {
        bucket: 'test',
        bucketPosition: 'pathname',
        key: 'file.txt',
        region: 'fra1',
      });
    });

    it('domain based root', () => {
      expectParsed('https://test.fra1.digitaloceanspaces.com/', {
        bucket: 'test',
        bucketPosition: 'hostname',
        key: '',
        region: 'fra1',
      });
    });

    it('hostname based', () => {
      expectParsed('https://test.fra1.digitaloceanspaces.com/file.txt', {
        bucket: 'test',
        bucketPosition: 'hostname',
        key: 'file.txt',
        region: 'fra1',
      });
    });

    it('hostname based with a dot', () => {
      expectParsed('https://dot.test.1.fra1.digitaloceanspaces.com/file.txt', {
        bucket: 'dot.test.1',
        bucketPosition: 'pathname',
        key: 'file.txt',
        region: 'fra1',
      });
    });

    it('CDN', () => {
      expectParsed('https://test.fra1.cdn.digitaloceanspaces.com/file.txt', {
        bucket: 'test',
        bucketPosition: 'hostname',
        cdn: true,
        key: 'file.txt',
        region: 'fra1',
      });
    });
  });

  describe('buildUrl', () => {
    it('builds a simple url', () => {
      expect(buildUrl('https://test.fra1.digitaloceanspaces.com/file.txt'))
        .toBe('https://test.fra1.digitaloceanspaces.com/file.txt');
    });

    it('builds a CDN url', () => {
      expect(buildUrl('https://test.fra1.cdn.digitaloceanspaces.com/file.txt'))
        .toBe('https://test.fra1.cdn.digitaloceanspaces.com/file.txt');
    });
  });

  function expectParsed(url, matchedObject) {
    const provider = new DigitalOceanSpacesProvider();
    expect(provider.parseUrl({ url })).toMatchObject(matchedObject);
  }

  function buildUrl(url) {
    const provider = new DigitalOceanSpacesProvider();
    const s3Url = url instanceof S3Url ? url : provider.parseUrl({ url });
    return provider.buildUrl({ s3Url });
  }
});
