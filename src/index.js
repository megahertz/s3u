'use strict';

const S3Parser = require('./S3Parser');
const S3Provider = require('./S3Provider');
const S3Url = require('./S3Url');

const s3Parser = new S3Parser({
  fallbackProvider: new S3Provider({ title: 'Generic' }),

  providers: [
    new S3Provider({
      domain: 'amazonaws.com',
      title: 'Amazon S3',
    }),

    new S3Provider({
      domain: 'stackpathstorage.com',
      title: 'Stackpath',
    }),
  ],
});

S3Url.setParser(s3Parser);

module.exports = {
  default: S3Url,
  S3Url,
  S3Parser,
  s3Parser,
  S3Provider,
};
