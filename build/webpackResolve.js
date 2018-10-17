const path = require('path')

const resolvePath = relativePath =>
  path.resolve(`${__dirname}/..`, relativePath)

const alias = {
  tool: resolvePath('./src/tool'),
  component: resolvePath('./src/component'),
  page: resolvePath('./src/page'),
  store: resolvePath('./src/store'),
  style: resolvePath('./src/style'),
  mixin: resolvePath('./src/mixin'),
  locale: resolvePath('./src/locale'),
  src: resolvePath('./src'),
  fixture: resolvePath('./__test__/fixture'),
}

module.exports = {
  alias,
  extensions: ['.js', '.jsx', '.css', '.less'],
}
