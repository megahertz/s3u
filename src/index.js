'use strict';

const AmazonAwsProvider = require('./providers/AmazonAwsProvider');
const S3Parser = require('./S3Parser');
const S3Provider = require('./S3Provider');
const S3Url = require('./S3Url');
const s3KeyUtils = require('./utils/s3key');

const s3Parser = new S3Parser({
  fallbackProvider: new S3Provider({ title: 'Generic' }),

  providers: [
    new AmazonAwsProvider(),

    new S3Provider({
      domain: 'digitaloceanspaces.com',
      title: 'DigitalOcean',
      endpoint: 'https://{region}.digitaloceanspaces.com',
    }),

    new AmazonAwsProvider({
      domain: 'stackpathstorage.com',
      title: 'Stackpath',
    }),
  ],
});

S3Url.setParser(s3Parser);

module.exports = {
  AmazonAwsProvider,
  default: S3Url,
  S3Url,
  S3Parser,
  s3Parser,
  S3Provider,
  ...s3KeyUtils,
};
