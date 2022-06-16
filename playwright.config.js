// @ts-check

/** @type {import('@playwright/test').PlaywrightTestConfig} */
const config = {
  testDir: './test',
  testMatch: [ '**/test/**/*.test.ts' ],
  use: {
    headless: false,
    browserName: 'chromium'
  }
};

module.exports = config;
