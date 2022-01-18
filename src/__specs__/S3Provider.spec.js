'use strict';

const { describe, expect, it } = require('humile');
const S3Provider = require('../S3Provider');

describe('S3Provider', () => {
  describe('parseUrl', () => {
    it('simple', () => {
      expectParsed('https://example.com/test/file.txt', {
        bucket: 'test',
        bucketPosition: 'pathname',
        key: 'file.txt',
        region: '',
      });
    });

    it('domain root with region', () => {
      expectParsed('https://test.example.com/', {
        bucket: '',
        bucketPosition: 'pathname',
        key: '',
        region: 'test',
      });
    });

    it('with region', () => {
      expectParsed('https://eu-west-2.example.com/test/file.txt', {
        bucket: 'test',
        bucketPosition: 'pathname',
        key: 'file.txt',
        region: 'eu-west-2',
      });
    });

    it('domain based with region', () => {
      expectParsed('https://test.eu-west-2.example.com/file.txt', {
        bucket: 'test',
        bucketPosition: 'hostname',
        key: 'file.txt',
        region: 'eu-west-2',
      });
    });

    function expectParsed(url, matchedObject) {
      const provider = new S3Provider({ domain: 'example.com' });
      expect(provider.parseUrl({ url })).toMatchObject(matchedObject);
    }
  });
});
