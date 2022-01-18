'use strict';

const { describe, expect, it } = require('humile');
const { S3Url } = require('../index');

describe('integration test', () => {
  describe('Amazon AWS', () => {
    describe('parse & buildUrl', () => {
      itIsConvertedFine('http://s3.amazonaws.com/');
      itIsConvertedFine('https://s3.amazonaws.com/');
      itIsConvertedFine('https://test.s3.amazonaws.com/');
      itIsConvertedFine('https://test.s3.us-est1.amazonaws.com/');
      itIsConvertedFine('https://test.s3.us-est1.amazonaws.com/dir1');
      itIsConvertedFine('https://s3.us-est1.amazonaws.com/test/dir1');
      itIsConvertedFine('https://s3.us-est1.amazonaws.com:8080/test/dir1');
      itIsConvertedFine('https://user:pass@s3.amazonaws.com:8080/test/dir1');
      itIsConvertedFine('https://test.s3.amazonaws.com/New+folder%25/file.txt');
      itIsConvertedFine(
        'https://test.s3-us-est1.amazonaws.com/',
        'https://test.s3.us-est1.amazonaws.com/'
      );

      it('converts s3: protocol to https', () => {
        const s3Url = new S3Url('s3://test/file.txt');
        s3Url.protocol = 'https:';
        expect(s3Url.href).toBe('https://test.s3.amazonaws.com/file.txt');
      });
    });
  });

  describe('Digital Ocean', () => {
    itIsConvertedFine('http://digitaloceanspaces.com/');
    itIsConvertedFine('https://fra1.digitaloceanspaces.com/');
    itIsConvertedFine('https://test.fra1.digitaloceanspaces.com/');
    itIsConvertedFine('https://test.fra1.digitaloceanspaces.com/');
    itIsConvertedFine('https://fra1.digitaloceanspaces.com/test/file.txt');
    itIsConvertedFine('https://test.fra1.digitaloceanspaces.com/file.txt');
    itIsConvertedFine('https://fra1.digitaloceanspaces.com/test/file.txt');
    itIsConvertedFine('https://test.fra1.digitaloceanspaces.com/file.txt');
  });

  describe('Stackpath', () => {
    itIsConvertedFine('http://s3.stackpathstorage.com/');
    itIsConvertedFine('https://s3.stackpathstorage.com/');
    itIsConvertedFine('https://test.s3.stackpathstorage.com/');
    itIsConvertedFine('https://test.s3.us-est1.stackpathstorage.com/');
    itIsConvertedFine('https://s3.stackpathstorage.com/test/file.txt');
    itIsConvertedFine('https://test.s3.stackpathstorage.com/file.txt');
    itIsConvertedFine(
      'https://s3.eu-west-2.stackpathstorage.com/test/file.txt'
    );
    itIsConvertedFine(
      'https://test.s3.eu-west-2.stackpathstorage.com/file.txt'
    );
  });

  describe('Generic', () => {
    itIsConvertedFine('http://example.com/');
    itIsConvertedFine('https://fra1.example.com/');
    itIsConvertedFine('https://test.fra1.example.com/');
    itIsConvertedFine('https://test.fra1.example.com/');
    itIsConvertedFine('https://fra1.example.com/test/file.txt');
    itIsConvertedFine('https://test.fra1.example.com/file.txt');
    itIsConvertedFine('https://fra1.example.com/test/file.txt');
    itIsConvertedFine('https://test.fra1.example.com/file.txt');

    it('return invalid url when cannot parse', () => {
      const s3Url = new S3Url('invalid-url');
      expect(s3Url).toMatchObject({
        bucket: '',
        isValid: false,
        provider: null,
      });
    });
  });
});

function itIsConvertedFine(srcUrl, resultUrl = srcUrl) {
  it(`is similar after parse: ${srcUrl}`, () => {
    const s3Url = new S3Url(srcUrl);
    expect(s3Url.href).toBe(resultUrl);
  });
}
