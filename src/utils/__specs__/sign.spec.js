'use strict';

const { describe, expect, it } = require('humile');
const { buildSignedUrl, buildSignedUrlSync } = require('../sign');
const fixtures = require('./sign.fixtures');

describe('sign', () => {
  describe(buildSignedUrl.name, () => {
    for (const [name, data] of Object.entries(fixtures)) {
      it(`matches ${name} test result`, async () => {
        const signedUrl = await buildSignedUrl(data.input);
        expect(signedUrl).toBe(data.output);
      });
    }
  });

  describe(buildSignedUrlSync.name, () => {
    for (const [name, data] of Object.entries(fixtures)) {
      it(`matches ${name} test result`, async () => {
        const signedUrl = buildSignedUrlSync(data.input);
        expect(signedUrl).toBe(data.output);
      });
    }
  });
});
