const fs = require('fs')

const routerTemplate = fs
  .readFileSync('./app/store.template.js')
  .toString('utf8')
const files = fs
  .readdirSync('./app/store')
  .filter(file => {
    // Main在模板中已经定义为主路由
    if (file === 'index.js') {
      return false
    }
    return true
  })
  .map(fileName => fileName.replace(/\.js$/, ''))

const imports = files.map(store => `import ${store} from 'store/${store}'`)

const importsPlaceholder = routerTemplate.replace(
  '/* imports-placeholder */',
  imports.join('\n'),
)
const storesPlaceholder = importsPlaceholder.replace(
  '/* stores-placeholder */',
  `${files.join(',\n  ')},
  /* 本路由文件由app/store.template.js文件生成，不要手动更改 */`,
)
fs.writeFileSync('./app/store/index.js', storesPlaceholder)
