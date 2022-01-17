'use strict';

const { describe, expect, it } = require('humile');
const S3Parser = require('../S3Parser');
const S3Provider = require('../S3Provider');

describe('S3Parser', () => {
  describe('addProvider', () => {
    it('requires implementation of matchHostName', () => {
      const parser = new S3Parser();

      expect(() => parser.addProvider({})).toThrowError(
        /should implement matchHostName/
      );
    });

    it('requires implementation of matchHostName', () => {
      const parser = new S3Parser();

      expect(() => parser.addProvider({ matchHostName() {} })).toThrowError(
        /should implement parseUrl/
      );
    });

    it('accepts a valid provider', () => {
      const parser = new S3Parser();

      parser.addProvider({
        matchHostName() {},
        parseUrl() {},
      });

      expect(parser.providers.length).toBe(1);
    });
  });

  it('getProvidersByHostName', () => {
    const parser = new S3Parser({
      providers: [new S3Provider({ domain: 'example.com' })],
    });

    const matchedProviders = parser.getProvidersByHostName('example.com');

    expect(matchedProviders[0]).toMatchObject({ domain: 'example.com' });
  });

  describe('getProvidersForParse', () => {
    const sp = new S3Provider({ domain: 'stackpathstorage.com' });
    const aws = new S3Provider({ domain: 'amazonaws.com' });

    const parser = new S3Parser({ providers: [sp, aws] });

    it('resolves a provider if hostname matches', () => {
      const providers = parser.getProvidersForParse({
        url: 'https://test.s3.amazonaws.com',
      });

      expect(providers).toEqual([aws]);
    });

    it('resolves the aws when s3 protocol is used', () => {
      const providers = parser.getProvidersForParse({
        url: 's3://test',
      });

      expect(providers).toEqual([aws]);
    });
  });

  describe('parseUrl', () => {
    const sp = new S3Provider({ domain: 'stackpathstorage.com' });
    const aws = new S3Provider({ domain: 'amazonaws.com' });
    const generic = new S3Provider({ title: 'Generic ' });

    const parser = new S3Parser({
      providers: [sp, aws],
      fallbackProvider: generic,
    });

    it('uses a generic provider', () => {
      const s3Url = parser.parseUrl({ url: 'https://test.example.com/' });
      expect(s3Url).toMatchObject({
        provider: generic,
      });
    });
  });
});
