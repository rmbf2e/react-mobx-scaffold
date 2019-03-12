const fs = require('fs')
const ejs = require('ejs')
const resolveRoot = require('./resolveRoot')
const prettyWrite = require('./prettyWrite')

const generateStore = () => {
  const storeTemplate = fs
    .readFileSync(resolveRoot('build/template/store.ejs'))
    .toString('utf8')

  const files = fs
    .readdirSync(resolveRoot('src/store'))
    .filter(f => f !== 'interface.ts')
    .map(fileName => fileName.replace(/\.(j|t)s$/, ''))

  const imports = files.map(store => `import {${store}} from 'store/${store}'`)

  const storeContent = ejs.render(storeTemplate, {
    imports: imports.join('\n'),
    stores: `${files.join(', ')}`,
  })

  prettyWrite(storeContent, 'src/store.ts')
}

module.exports = generateStore
