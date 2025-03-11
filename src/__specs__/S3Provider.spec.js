'use strict';

const { describe, expect, it } = require('humile');
const AmazonAwsProvider = require('../providers/AmazonAwsProvider');
const S3Provider = require('../S3Provider');
const S3Url = require('../S3Url');
const signFixtures = require('../utils/__specs__/sign.fixtures');

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
        bucketPosition: 'hostname',
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

  describe('buildSignedUrl', () => {
    it('simple', async () => {
      const s3Url = new S3Url('https://bucket.s3.amazonaws.com/test/file.zip');
      const provider = new AmazonAwsProvider();
      const signedUrl = await provider.buildSignedUrl({
        ...signFixtures.simpleAwsSign.input,
        url: '', // make sure it's not used
        s3Url,
      });
      expect(signedUrl).toBe(signFixtures.simpleAwsSign.output);
    });
  });
});
