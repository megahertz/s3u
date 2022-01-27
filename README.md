# s3u
[![Tests](https://github.com/megahertz/s3u/actions/workflows/tests.yml/badge.svg)](https://github.com/megahertz/s3u/actions/workflows/tests.yml)
[![npm version](https://badge.fury.io/js/s3u.svg)](https://badge.fury.io/js/s3u)

## Description

S3 URL manipulation helper similar to standard URL class

### Key features

 - Support different S3 providers
 - Support both Node.js and browser environment
 - Simple and lightweight
 - No dependencies
 - Typescript support
 - Built-in presigned URL generation

## Installation

Install with [npm](https://npmjs.org/package/s3u):

    npm install --save s3u

## Usage

```js
const { S3Url } = require('s3u');

const s3Url = new S3Url('https://mybucket.s3.amazonaws.com/');

// Changing attributes
s3Url.key = 'My file.txt';
s3Url.region = 'eu-west-2'

console.log(url.href);
// https://mybucket.s3.eu-west-2.amazonaws.com/My+file.txt

console.log(s3Url);
/*
S3Url {
  bucket: 'mybucket',
  bucketPosition: 'hostname',
  cdn: false,
  domain: 'amazonaws.com',
  error: null,
  hash: '',
  key: 'My file.txt',
  password: '',
  port: '',
  protocol: 'https:',
  provider: AmazonAwsProvider {
    domain: 'amazonaws.com',
    endpoint: 'https://s3.{region}.amazonaws.com',
    id: 'amazonaws.com',
    title: 'Amazon S3'
  },
  region: 'eu-west-2',
  search: '',
  sourceUrl: 'https://mybucket.s3.amazonaws.com/',
  username: ''
}
 */

// Making a http copy
const httpUrl = s3Url.clone({ protocol: 'http:' }).href;

// Generaing presigned URL, AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY
// env vars can be used instead of passing arguments
const presignedUrl = s3Url.sign({ accessKeyId, secretAccessKey });
```

## Providers

Currently, the library is tested with the following providers:

 - Amazon S3
 - DigitalOcean Spaces
 - Stackpath Storage
 - Generic provider (Supports URL schema like bucket.region.example.com)

### Adding a custom provider based on existed implementation:

```js
const { s3Parser, S3Provider } = require('s3u');

s3Parser.addProvider(new S3Provider({
  domain: 'storage.example.com',
  title: 'Example provider',
}))
```

### Adding a custom provider implementation

To add a parser for a custom provider you need to extend S3Provider class.
You can use [AmazonAwsProvider.js](src/providers/AmazonAwsProvider.js) as 
an example.

```js
const { s3Parser, S3Provider } = require('s3u');

class NewProvider extends S3Provider {
  buildHostName({ s3Url }) {
    return [
      s3Url.bucketPosition === 'hostname' && s3Url.bucket,
      'files',
      s3Url.domain || this.domain,
    ]
    .filter(Boolean)
    .join('.');
  }
}

s3Parser.addProvider(new NewProvider({
  domain: 'example.com',
  title: 'Example provider',
}))
```

## License

Licensed under MIT.
