'use strict';

const S3Url = require('./S3Url');

class S3Parser {
  providers = [];
  fallbackProvider = null;

  constructor({ providers = [], fallbackProvider = null }) {
    providers.forEach((provider) => this.addProvider(provider));
    this.fallbackProvider = fallbackProvider;
  }

  addProvider(provider) {
    if (typeof provider.matchHostName !== 'function') {
      throw new Error('Provider should implement matchHostName method');
    }

    if (typeof provider.parseUrl !== 'function') {
      throw new Error('Provider should implement parseUrl method');
    }

    this.providers.push(provider);
  }

  getProvidersByHostName(hostName) {
    return this.providers.filter((p) => p.matchHostName(hostName));
  }

  getProviderById(providerId) {
    if (!providerId) {
      return null;
    }

    return this.providers.find((p) => p.id === providerId);
  }

  getProvidersForParse({ url, providerId = null }) {
    if (providerId) {
      const provider = this.getProviderById(providerId);
      if (provider) {
        return [provider];
      }
    }

    try {
      const urlObj = new URL(url);

      if (urlObj.protocol === 's3') {
        return [this.getProviderById('amazonaws.com')];
      }

      return this.getProvidersByHostName(urlObj.hostname);
    } catch {
      return [];
    }
  }

  parseUrl({ url, providerId = null }) {
    const providers = this.getProvidersForParse({ url, providerId });

    for (const provider of providers) {
      try {
        const s3Url = provider.parseUrl({ url });
        if (s3Url) {
          return s3Url;
        }
      } catch (e) {
        // Can't parse, try another provider
      }
    }

    try {
      const s3Url = this.fallbackProvider?.parseUrl(url);
      if (s3Url) {
        return s3Url;
      }
    } catch (e) {
      return new S3Url({ error: e, sourceUrl: url });
    }

    return new S3Url({ sourceUrl: url });
  }
}

module.exports = S3Parser;
