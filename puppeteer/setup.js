const { setup: setupPuppeteer } = require('jest-environment-puppeteer')

module.exports = async function globalSetup() {
  await setupPuppeteer()
  // Your global setup
}
