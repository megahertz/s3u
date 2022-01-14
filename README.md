# s3u
[![Tests](https://github.com/megahertz/s3u/workflows/Tests/badge.svg)](https://github.com/megahertz/s3u/actions?query=workflow%3ATests)
[![npm version](https://badge.fury.io/js/s3u.svg)](https://badge.fury.io/js/s3u)

## Description

S3 URL manipulation helper

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

const url = S3Url.fromUrl('https://mybucket.s3.amazonaws.com/');

url.key = 'My file.txt';

console.log(url.toString());
// https://mybucket.s3.amazonaws.com/My+file.txt
```

## License

Licensed under MIT.
