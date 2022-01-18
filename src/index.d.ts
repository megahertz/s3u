export class S3Url {
  bucket: string;
  bucketPosition: 'hostname' | 'pathname';
  domain: string;
  error?: Error;
  hash: string;
  key: string;
  password: string;
  port: string;
  protocol: string;
  provider?: S3Provider;
  region: string;
  search: string;
  sourceUrl: string;
  username: string;

  readonly href: string;

  constructor(attrs: Partial<S3Url> | string);

  static fromUrl(url: string): S3Url;

  clone(newAttrs?: Partial<S3Url>): S3Url;
  isValid(): boolean;
  makeUrl(): string;
  setBucket(bucket: string): void;
  setBucketPosition(position: 'hostname' | 'pathname'): void;
  setDomain(domain: string): void;
  setKey(key: string): void;
  setRegion(region: string): void;
}

export interface ProviderInterface {
  buildUrl({ s3Url }: { s3Url: S3Url }): string;
  matchHostName(hostName: string): boolean;
}

export class S3Provider implements ProviderInterface {
  domain: string;
  endpoint: string;
  id: string;
  title: string;

  constructor(options: {
    id?: string,
    domain: string,
    endpoint?: string,
    title: string
  });

  buildUrl({ s3Url }: { s3Url: S3Url }): string;
  getEndpoint({ region }?: { region: string }): string;
  matchHostName(hostName: string): boolean;
  parseUrl({ url }: { url: string }): S3Url;

  protected buildHostName({ s3Url }: { s3Url: S3Url }): string;
  protected buildPathName({ s3Url }: { s3Url: S3Url }): string;
  protected parseBucket(hostname: string, s3Url: S3Url): string;
  protected parseBucketFromPathname(hostname: string, s3Url: S3Url): string;
  protected parseDomain(hostname: string, s3Url: S3Url): string;
  protected parseRegion(hostname: string, s3Url: S3Url): string;
}

export class AmazonAwsProvider extends S3Provider {}

export class S3Parser {
  providers: S3Provider[];
  fallbackProvider?: S3Provider;

  constructor(options: {
    providers: S3Provider[],
    fallbackProvider?: S3Provider
  });

  addProvider(provider: S3Provider): void;
  getProviderById(providerId: string): S3Provider;
  getProvidersByHostName(hostName: string): S3Provider[];
  getProvidersForParse(options: {
    url: string,
    providerId?: string
  }): S3Provider[];
  parseUrl(options: {
    url: string,
    providerId?: string
  }): S3Url;
}

export const s3Parser: S3Parser;

export function decodeS3Key(key: string): string;
export function encodeS3Key(key: string): string;

export default S3Url;
