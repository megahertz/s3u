/* eslint-disable no-unused-vars */

import { decodeS3Key, encodeS3Key, S3Url } from '../index';

const s3 = new S3Url('https://s3.amazonaws.com');
const url = s3.href;
const key = decodeS3Key(encodeS3Key('New folder/file.txt'));
