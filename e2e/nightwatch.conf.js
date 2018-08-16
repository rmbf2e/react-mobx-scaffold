require('babel-register')
// const webpackConfig = require('../webpack.config.babel.js').default
const config = require('./config')

// http://nightwatchjs.org/gettingstarted#settings-file
module.exports = {
  src_folders: ['e2e/spec'],
  output_folder: 'e2e/report',
  custom_assertions_path: [
    'e2e/customAssertion',
    'node_modules/nightwatch-helpers/assertions',
  ],
  custom_commands_path: [
    'e2e/customCommand',
    'node_modules/nightwatch-helpers/commands',
    'share/nightwatch/command',
  ],

  selenium: {
    start_process: true,
    // eslint-disable-next-line
    server_path: require('selenium-server').path,
    host: '127.0.0.1',
    port: 4444,
    cli_args: {
      // eslint-disable-next-line
      'webdriver.chrome.driver': require('chromedriver').path,
      // 'webdriver.gecko.driver': '/path/to/geckodriver',
    },
  },

  test_settings: {
    default: {
      selenium_port: 4444,
      selenium_host: 'localhost',
      silent: true,
      globals: {
        devServerURL: config.host,
      },
    },

    chrome: {
      desiredCapabilities: {
        browserName: 'chrome',
        javascriptEnabled: true,
        acceptSslCerts: true,
        chromeOptions: {
          args: ['start-fullscreen'],
          // args: ['--headless', '--disable-gpu=true'],
        },
      },
    },

    // firefox: {
    //   desiredCapabilities: {
    //     browserName: 'firefox',
    //     javascriptEnabled: true,
    //     marionette: true,
    //     acceptSslCerts: true,
    //   },
    // },
  },
}
