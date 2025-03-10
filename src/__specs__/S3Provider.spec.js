'use strict';

const { describe, expect, it } = require('humile');
const AmazonAwsProvider = require('../providers/AmazonAwsProvider');
const S3Provider = require('../S3Provider');
const S3Url = require('../S3Url');

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
        accessKeyId: 'test',
        secretAccessKey: 'test',
        s3Url,
        timestamp: 0,
      });
      expect(signedUrl).toBe(
        'https://bucket.s3.us-east-1.amazonaws.com/test/file.zip'
        + '?X-Amz-Algorithm=AWS4-HMAC-SHA256'
        + '&X-Amz-Credential=test%2F19700101%2Fus-east-1%2Fs3%2Faws4_request'
        + '&X-Amz-Date=19700101T000000Z'
        + '&X-Amz-Expires=604800'
        + '&X-Amz-SignedHeaders=host'
        // eslint-disable-next-line max-len
        + '&X-Amz-Signature=cbefd44bf6ccaec9a70b2eff6bcc17d14039c2d204c5e58545986fcf76cf28be'
      );
    });
  });
});
