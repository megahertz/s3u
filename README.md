# s3u
[![Tests](https://github.com/megahertz/s3u/actions/workflows/tests.yml/badge.svg)](https://github.com/megahertz/s3u/actions/workflows/tests.yml)
[![npm version](https://badge.fury.io/js/s3u.svg)](https://badge.fury.io/js/s3u)

## Description

S3 URL manipulation helper similar to standard URL class

### Key features

 - Support different S3 providers
 - Simple and lightweight
 - No dependencies

## Installation

Install with [npm](https://npmjs.org/package/s3u):

    npm install --save s3u

## Usage

```js
const { S3Url } = require('s3u');

const url = new S3Url('https://mybucket.s3.amazonaws.com/');

url.key = 'My file.txt';
url.region = 'eu-west-2'

console.log(url.href);
// https://mybucket.s3.eu-west-2.amazonaws.com/My+file.txt
```

## License

Licensed under MIT.
