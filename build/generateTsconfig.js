const reduce = require('lodash/reduce')
const path = require('path')
const { alias } = require('./pathAlias')
const tslintConfig = require('./template/tslint.json')
const tsconfig = require('./template/tsconfig.json')
const prettyWrite = require('./prettyWrite')

const generateTsconfig = () => {
  tsconfig.compilerOptions.paths = reduce(
    alias,
    (r, v, k) => {
      r[`${k}/*`] = [`${v.replace(`${path.resolve(__dirname, '..')}/`, '')}/*`]
      return r
    },
    {},
  )

  tslintConfig.rules['no-implicit-dependencies'] = [true, Object.keys(alias)]
  prettyWrite(JSON.stringify(tsconfig), 'tsconfig.json')
  prettyWrite(JSON.stringify(tslintConfig), 'tslint.json')
}

module.exports = generateTsconfig
