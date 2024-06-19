/* eslint-disable no-unused-vars */

import { S3Url } from '../index';

const s3 = new S3Url('https://s3.amazonaws.com');
const url = s3.href;
