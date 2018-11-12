// this is config for jest-environment-puppeteer

module.exports = {
  launch: {
    // dumpio: true,
    headless: !process.env.DEBUG,
    args: [
      '--ash-host-window-bounds=1920x1080',
      '--window-size=1920,1080',
      '--window-position=0,0',

      // when need some chrome extensions
      // `--disable-extensions-except=${pathToExtension}`,
      // `--load-extension=${pathToExtension}`
    ],
    devtools: true,
    slowMo: 250,
    timeout: 0,
    executablePath: '/usr/bin/google-chrome-stable',
  },
}
