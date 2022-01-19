'use strict';

const { describe, expect, it } = require('humile');
const AmazonAwsProvider = require('../AmazonAwsProvider');

describe('AmazonAwsProvider', () => {
  describe('parseUrl', () => {
    it('simple', () => {
      expectParsed('https://s3.amazonaws.com/test/file.txt', {
        bucket: 'test',
        bucketPosition: 'pathname',
        key: 'file.txt',
        region: '',
      });
    });

    it('domain based root', () => {
      expectParsed('https://test.s3.amazonaws.com/', {
        bucket: 'test',
        bucketPosition: 'hostname',
        key: '',
        region: '',
      });
    });

    it('hostname based', () => {
      expectParsed('https://test.s3.amazonaws.com/file.txt', {
        bucket: 'test',
        bucketPosition: 'hostname',
        key: 'file.txt',
        region: '',
      });
    });

    it('hostname based with a dot', () => {
      expectParsed('https://dot.test.1.s3.amazonaws.com/file.txt', {
        bucket: 'dot.test.1',
        bucketPosition: 'pathname',
        key: 'file.txt',
        region: '',
      });
    });

    it('with region', () => {
      expectParsed('https://s3.eu-west-2.amazonaws.com/test/file.txt', {
        bucket: 'test',
        bucketPosition: 'pathname',
        key: 'file.txt',
        region: 'eu-west-2',
      });
    });

    it('domain based with region', () => {
      expectParsed('https://test.s3.eu-west-2.amazonaws.com/file.txt', {
        bucket: 'test',
        bucketPosition: 'hostname',
        key: 'file.txt',
        region: 'eu-west-2',
      });
    });

    it('domain based with dot and region', () => {
      expectParsed('https://dot.test.2.s3.eu-west-2.amazonaws.com/file.txt', {
        bucket: 'dot.test.2',
        bucketPosition: 'pathname',
        key: 'file.txt',
        region: 'eu-west-2',
      });
    });
  });

  function expectParsed(url, matchedObject) {
    const provider = new AmazonAwsProvider();
    expect(provider.parseUrl({ url })).toMatchObject(matchedObject);
  }
});
