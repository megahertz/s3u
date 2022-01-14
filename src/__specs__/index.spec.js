'use strict';

const { describe, expect, it } = require('humile');
const { S3Url } = require('../index');

describe('integration test', () => {
  describe('parse & buildUrl', () => {
    itIsSimilarAfterParse('http://s3.amazonaws.com/');
    itIsSimilarAfterParse('https://s3.amazonaws.com/');
    itIsSimilarAfterParse('https://test.s3.amazonaws.com/');
    itIsSimilarAfterParse('https://test.s3.us-est1.amazonaws.com/');
    itIsSimilarAfterParse('https://test.s3.us-est1.amazonaws.com/dir1');
    itIsSimilarAfterParse('https://s3.us-est1.amazonaws.com/test/dir1');
    itIsSimilarAfterParse('https://s3.us-est1.amazonaws.com:8080/test/dir1');
    itIsSimilarAfterParse('https://user:pass@s3.amazonaws.com:8080/test/dir1');
  });
});

function itIsSimilarAfterParse(url) {
  it(`is similar after parse: ${url}`, () => {
    const s3Url = S3Url.fromUrl(url);
    expect(s3Url.makeUrl()).toBe(url);
  });
}
