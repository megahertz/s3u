'use strict';

const { describe, expect, it } = require('humile');
const S3Provider = require('../S3Provider');

describe('S3Provider', () => {
  describe('parseUrl', () => {
    const provider = new S3Provider({ domain: 'example.com' });

    it('simple', () => {
      expect(parse('https://example.com/test/file.txt')).toMatchObject({
        bucket: 'test',
        bucketPosition: 'pathname',
        key: 'file.txt',
        region: '',
      });
    });

    it('domain root with region', () => {
      expect(parse('https://test.example.com/')).toMatchObject({
        bucket: '',
        bucketPosition: 'pathname',
        key: '',
        region: 'test',
        provider,
      });
    });

    it('with region', () => {
      expect(
        parse('https://eu-west-2.example.com/test/file.txt')
      ).toMatchObject({
        bucket: 'test',
        bucketPosition: 'pathname',
        key: 'file.txt',
        region: 'eu-west-2',
        provider,
      });
    });

    it('domain based with region', () => {
      expect(
        parse('https://test.eu-west-2.example.com/file.txt')
      ).toMatchObject({
        bucket: 'test',
        bucketPosition: 'hostname',
        key: 'file.txt',
        region: 'eu-west-2',
        provider,
      });
    });

    function parse(url) {
      return provider.parseUrl({ url });
    }
  });
});
