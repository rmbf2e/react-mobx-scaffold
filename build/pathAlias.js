const resolveRoot = require('./resolveRoot')

module.exports.alias = {
  tool: resolveRoot('src/tool'),
  component: resolveRoot('src/component'),
  page: resolveRoot('src/page'),
  store: resolveRoot('src/store'),
  extendStore: resolveRoot('src/extendStore'),
  style: resolveRoot('src/style'),
  mixin: resolveRoot('src/mixin'),
  locale: resolveRoot('src/locale'),
  src: resolveRoot('src'),
  fixture: resolveRoot('__test__/fixture'),
}
