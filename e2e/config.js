const webpackConfig = require('../build/config')

module.exports = {
  host: `${webpackConfig.https ? 'https' : 'http'}://localhost:${
    webpackConfig.port
  }`,
}
