const fs = require('fs')
const lowerFirst = require('lodash/lowerFirst')

const routerTemplate = fs
  .readFileSync('./app/router.template.jsx')
  .toString('utf8')
const routers = fs
  .readdirSync('./app/page')
  .filter(file => {
    // Main在模板中已经定义为主路由
    if (file === 'Home') {
      return false
    }
    return true
  })
  .map(
    router => `{
    key: '${router}',
    component: Loadable({
      loader: () => import('./page/${router}'),
      loading,
    }),
    path: '/${lowerFirst(router)}'
  }`,
  )
const templatePlaceholder = routerTemplate.replace(
  '/* template-placeholder */',
  `${routers.join(',\n  ')},\n
  /* 本路由文件由app/router.template.js文件生成，不要手动更改 */`,
)
fs.writeFileSync('./app/router.jsx', templatePlaceholder)
