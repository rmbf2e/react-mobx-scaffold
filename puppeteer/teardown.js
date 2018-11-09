const { teardown: teardownPuppeteer } = require('jest-environment-puppeteer')

module.exports = async function globalTeardown() {
  // Your global teardown
  await teardownPuppeteer()
}
