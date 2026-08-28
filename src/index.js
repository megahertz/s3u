/* eslint-disable operator-linebreak */

'use strict';

const AmazonAwsProvider = require('./providers/AmazonAwsProvider');
const CloudflareR2Provider = require('./providers/CloudflareR2Provider');
const DigitalOceanSpacesProvider =
  require('./providers/DigitalOceanSpacesProvider');
const S3Parser = require('./S3Parser');
const S3Provider = require('./S3Provider');
const S3Url = require('./S3Url');
const {
  decodeS3Key,
  encodeS3Key,
  encodeSpecialUrlChars,
} = require('./utils/encode');

const s3Parser = new S3Parser({
  fallbackProvider: new S3Provider({ id: 'generic', title: 'Generic' }),

  providers: [
    new AmazonAwsProvider(),
    new CloudflareR2Provider(),
    new DigitalOceanSpacesProvider(),
    new AmazonAwsProvider({
      domain: 'stackpathstorage.com',
      title: 'Stackpath',
    }),
  ],
});

S3Url.setParser(s3Parser);

module.exports = {
  AmazonAwsProvider,
  CloudflareR2Provider,
  decodeS3Key,
  default: S3Url,
  DigitalOceanSpacesProvider,
  encodeS3Key,
  encodeSpecialUrlChars,
  S3Url,
  S3Parser,
  s3Parser,
  S3Provider,
};
