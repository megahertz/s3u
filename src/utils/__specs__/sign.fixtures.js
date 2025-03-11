'use strict';

/* eslint-disable max-len */

module.exports = {
  simpleAwsSign: {
    input: {
      accessKeyId: 'test',
      secretAccessKey: 'test',
      region: 'us-east-1',
      timestamp: 0,
      url: 'https://bucket.s3.us-east-1.amazonaws.com/test/file.zip',
    },
    output: 'https://bucket.s3.us-east-1.amazonaws.com/test/file.zip'
      + '?X-Amz-Algorithm=AWS4-HMAC-SHA256'
      + '&X-Amz-Credential=test%2F19700101%2Fus-east-1%2Fs3%2Faws4_request'
      + '&X-Amz-Date=19700101T000000Z'
      + '&X-Amz-Expires=604800'
      + '&X-Amz-SignedHeaders=host'
      + '&X-Amz-Signature=cbefd44bf6ccaec9a70b2eff6bcc17d14039c2d204c5e58545986fcf76cf28be',
  },
};
