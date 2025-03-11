'use strict';

const { describe, expect, it } = require('humile');
const { S3Url } = require('..');
const signFixtures = require('../utils/__specs__/sign.fixtures');

describe(S3Url.name, () => {
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

  describe('fileName', () => {
    it('returns empty string if a key is empty', () => {
      const s3Url = new S3Url('https://bucket.s3.amazonaws.com/');
      expect(s3Url.fileName).toBe('');
    });

    it('returns dirname', () => {
      const s3Url = new S3Url('https://bucket.s3.amazonaws.com/test');
      expect(s3Url.fileName).toBe('test');
    });

    it('returns actual file name', () => {
      const s3Url = new S3Url('https://bucket.s3.amazonaws.com/test/file.zip');
      expect(s3Url.fileName).toBe('file.zip');
    });
  });

  describe('fileName', () => {
    it('returns empty string if a key is empty', () => {
      const s3Url = new S3Url('https://bucket.s3.amazonaws.com/');
      expect(s3Url.fileName).toBe('');
    });

    it('returns empty string if end slash', () => {
      const s3Url = new S3Url('https://bucket.s3.amazonaws.com/test/');
      expect(s3Url.fileName).toBe('');
    });

    it('returns dirname', () => {
      const s3Url = new S3Url('https://bucket.s3.amazonaws.com/test');
      expect(s3Url.fileName).toBe('test');
    });

    it('returns actual file name', () => {
      const s3Url = new S3Url('https://bucket.s3.amazonaws.com/test/file.zip');
      expect(s3Url.fileName).toBe('file.zip');
    });

    it('sets empty filename when it\'s already empty', () => {
      const s3Url = new S3Url('https://bucket.s3.amazonaws.com/');

      s3Url.setFileName('');

      expect(s3Url.key).toBe('');
    });

    it('sets new filename when it\'s already empty', () => {
      const s3Url = new S3Url('https://bucket.s3.amazonaws.com/');

      s3Url.setFileName('file.zip');

      expect(s3Url.key).toBe('file.zip');
    });

    it('sets empty filename when it was previously set', () => {
      const s3Url = new S3Url('https://bucket.s3.amazonaws.com/dir/file.zip');

      s3Url.setFileName('');

      expect(s3Url.key).toBe('dir/');
    });

    it('sets new filename when it was previously set', () => {
      const s3Url = new S3Url('https://bucket.s3.amazonaws.com/dir/file.zip');

      s3Url.setFileName('newfile.zip');

      expect(s3Url.key).toBe('dir/newfile.zip');
    });
  });

  describe('dirPath', () => {
    it('returns empty string if a key is empty', () => {
      const s3Url = new S3Url('https://bucket.s3.amazonaws.com/');
      expect(s3Url.dirPath).toBe('');
    });

    it('returns empty string if in the root', () => {
      const s3Url = new S3Url('https://bucket.s3.amazonaws.com/test');
      expect(s3Url.dirPath).toBe('');
    });

    it('returns actual dir path', () => {
      const s3Url = new S3Url('https://bucket.s3.amazonaws.com/test/file.zip');
      expect(s3Url.dirPath).toBe('test');
    });

    it('sets empty dir path when it\'s already empty', () => {
      const s3Url = new S3Url('https://bucket.s3.amazonaws.com/');

      s3Url.setDirPath('');

      expect(s3Url.key).toBe('');
    });

    it('sets new dir path when it\'s already empty', () => {
      const s3Url = new S3Url('https://bucket.s3.amazonaws.com/');

      s3Url.setDirPath('dir');

      expect(s3Url.key).toBe('dir/');
    });

    it('sets empty dir path when it was previously set', () => {
      const s3Url = new S3Url('https://bucket.s3.amazonaws.com/dir/file.zip');

      s3Url.setDirPath('');

      expect(s3Url.key).toBe('file.zip');
    });

    it('sets new dir path when it was previously set', () => {
      const s3Url = new S3Url('https://bucket.s3.amazonaws.com/dir/file.zip');

      s3Url.setDirPath('newdir');

      expect(s3Url.key).toBe('newdir/file.zip');
    });
  });

  describe(S3Url.prototype.clone.name, () => {
    it('changes a key and bucket', () => {
      const s3Url = new S3Url('https://mybucket.s3.amazonaws.com/');

      expect(
        s3Url.clone({ key: 'My file.txt', region: 'eu-west-2' }).href
      ).toBe(
        'https://mybucket.s3.eu-west-2.amazonaws.com/My+file.txt'
      );
    });
  });

  describe(S3Url.prototype.sign.name, () => {
    it('signs a url', async () => {
      const s3Url = new S3Url(signFixtures.simpleAwsSign.input.url);
      const signedUrl = await s3Url.sign(signFixtures.simpleAwsSign.input);
      expect(signedUrl).toBe(signFixtures.simpleAwsSign.output);
    });
  });

  describe(S3Url.prototype.signSync.name, () => {
    it('signs a url', () => {
      const s3Url = new S3Url(signFixtures.simpleAwsSign.input.url);
      const signedUrl = s3Url.signSync(signFixtures.simpleAwsSign.input);
      expect(signedUrl).toBe(signFixtures.simpleAwsSign.output);
    });
  });

  describe(S3Url.prototype.trimSlashes.name, () => {
    it('trims end slash', () => {
      const s3Url = new S3Url('https://bucket.s3.amazonaws.com/dir/file.zip/');
      expect(s3Url.key).toBe('dir/file.zip/');

      s3Url.trimSlashes({ end: true });

      expect(s3Url.key).toBe('dir/file.zip');
    });

    it('trims begin slash', () => {
      const s3Url = new S3Url('https://bucket.s3.amazonaws.com/');
      s3Url.key = '/dir/file.zip';

      s3Url.trimSlashes({ begin: true });

      expect(s3Url.key).toBe('dir/file.zip');
    });
  });
});
