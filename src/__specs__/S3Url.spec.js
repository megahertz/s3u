'use strict';

const { describe, expect, it } = require('humile');
const { S3Url } = require('..');

describe('S3Url', () => {
  describe('isValid', () => {
    it('true when provider is detected', () => {
      const s3Url = new S3Url('https://mybucket.s3.amazonaws.com/');
      expect(s3Url.isValid).toBe(true);
    });

    it('false when url cannot be parsed', () => {
      const s3Url = new S3Url('https://not-valid');
      expect(s3Url.isValid).toBe(false);
    });
  });

  describe('clone', () => {
    it('changes a key and bucket', () => {
      const s3Url = new S3Url('https://mybucket.s3.amazonaws.com/');

      expect(
        s3Url.clone({ key: 'My file.txt', region: 'eu-west-2' }).href
      ).toBe(
        'https://mybucket.s3.eu-west-2.amazonaws.com/My+file.txt'
      );
    });
  });
});
