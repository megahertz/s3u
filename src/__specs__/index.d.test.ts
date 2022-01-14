import { S3Url } from '../index';

const s3 = S3Url.fromUrl('https://s3.amazonaws.com');
s3.makeUrl()
